CREATE TABLE IF NOT EXISTS User (
    UserId INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) UNIQUE,
    DateCreated DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS Party (
    GroupId INT AUTO_INCREMENT PRIMARY KEY,
    GroupName VARCHAR(100) NOT NULL,
    CreatedBy INT NOT NULL,
    CreateAt Timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DeleteAt Timestamp,
    FOREIGN KEY (CreatedBy) REFERENCES User(UserId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PartyMember (
    GroupId INT NOT NULL,
    UserId INT NOT NULL,
    PRIMARY KEY (GroupId, UserId),
    FOREIGN KEY (GroupId) REFERENCES Party(GroupId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE
);

DELIMITER //

DROP TRIGGER IF EXISTS insert_party_member;

CREATE TRIGGER insert_party_member
AFTER INSERT ON Party
FOR EACH ROW
BEGIN
    INSERT INTO PartyMember (GroupId, UserId)
    VALUES (NEW.GroupId, NEW.CreatedBy);
END;
//


DROP TRIGGER IF EXISTS remove_party_member;

CREATE TRIGGER remove_party_member BEFORE DELETE ON Party
FOR EACH ROW
BEGIN
  DELETE FROM PartyMember
  WHERE GroupId = OLD.GroupId AND UserId = OLD.CreatedBy;
END;

//
DELIMITER ;

CREATE TABLE IF NOT EXISTS Transaction (
    TransactionId INT AUTO_INCREMENT PRIMARY KEY,
    GroupId INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    CurrencyType VARCHAR(3) NOT NULL,
    Date DATE NOT NULL,
    SenderId INT NOT NULL,
    ReceiverId INT NOT NULL,
    FOREIGN KEY (GroupId) REFERENCES Party(GroupId) ON DELETE CASCADE,
    FOREIGN KEY (SenderId) REFERENCES User(UserId) ON DELETE CASCADE,
    FOREIGN KEY (ReceiverId) REFERENCES User(UserId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Spending (
    SpendingId INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyType VARCHAR(3) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    GroupId INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (GroupId) REFERENCES Party(GroupId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CurrencyExchange (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Timestamp Timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    SourceCurrency VARCHAR(3) NOT NULL,
    TargetCurrency VARCHAR(3) NOT NULL,
    Rate REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS Inflation (
    Id INT AUTO_INCREMENT,
    Year INT NOT NULL,
    Month INT NOT NULL,
    Rate REAL NOT NULL,
    PRIMARY KEY (Year, Month),
    UNIQUE (Id)
);

DELIMITER //

DROP PROCEDURE IF EXISTS `debug_msg`//

CREATE PROCEDURE debug_msg(enabled INTEGER, msg VARCHAR(255))
BEGIN
  IF enabled THEN
    select concat('** ', msg) AS '** DEBUG:';
  END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS AddTransaction(
    IN spending_id INT,
    IN input_currency VARCHAR(3),
    IN amt DECIMAL(10, 2),
    IN sender_id INT
)
BEGIN
    DECLARE group_id INT;
    DECLARE spending_currency VARCHAR(3);
    DECLARE receiver_id INT;
    DECLARE r DECIMAL(10, 2);
    DECLARE converted_amt DECIMAL(10, 2);

    SELECT Spending.GroupId, Spending.CurrencyType, Party.CreatedBy
    INTO group_id, spending_currency, receiver_id
    FROM Spending
    JOIN Party ON Spending.GroupId = Party.GroupId
    WHERE SpendingId = spending_id;

    IF input_currency != spending_currency THEN
        SELECT Rate 
        INTO r
        FROM CurrencyExchange
        WHERE SourceCurrency = input_currency AND TargetCurrency = spending_currency
        ORDER BY Id DESC
        LIMIT 1;

        SELECT r;

        IF r IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Exchange rate not found for the given currencies';
        END IF;

        SET converted_amt = amt * r;
    ELSE
        SET converted_amt = amt;
    END IF;

    INSERT INTO Transaction (GroupId, Amount, CurrencyType, Date, SenderId, ReceiverId)
    VALUES (group_id, converted_amt, input_currency, curdate(), sender_id, receiver_id);

    UPDATE Spending
    SET Amount = Amount - converted_amt
    WHERE SpendingId = spending_id;

    DELETE FROM Spending
    WHERE Amount <= 0
      AND SpendingId = spending_id;
END

//
DELIMITER ;
