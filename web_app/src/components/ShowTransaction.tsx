import  { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import UserContext from '../context/UserContext';
import { getTransactions, type Transaction } from '../request/transaction';
import { useNavigate } from 'react-router-dom';
import { type User } from '../request/user'
import { Box, Grid2 as Grid } from '@mui/material';


const TableContainer = styled.div`
  max-height: 650px;
  overflow-y: auto;
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
`;

const StyledGrid = styled(Box)`
    padding: 20px;
    background-color: #D2D2D0;
`;


const Title = styled.h2`
    color: #2c3e50;
    font-size: 28px;
    margin-bottom: -20px;
    margin-top: -10px;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1.2px;
`;

const TransactionList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
`;

const TableHead = styled.thead`
    background-color: #f4f6f8;
`;

const TableHeader = styled.th`
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    padding: 10px;
    color: #34495e;
    border-bottom: 2px solid #dcdcdc;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
    &:nth-child(odd) {
        background-color: #f0f0f0;
    }
`;

const TableCell = styled.td`
    padding: 12px 10px;
    font-size: 14px;
    color: #34495e;
    border-bottom: 1px solid #e0e0e0;
`;


const ShowTransaction = () => {
    const [sentTransactions, setSentTransactions] = useState<(Transaction & User)[]>([]);
    const [receivedTransactions, setReceivedTransactions] = useState<(Transaction & User)[]>([]);
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
  
    if (!login) {
      navigate('/login');
      return null;
    }
  
    useEffect(() => {
      const fetchTransaction = async () => {
        try {
          const response = await getTransactions(login.UserId);
          console.log('Fetched Transaction Response:', response);
  
          setSentTransactions(response.sentTransactions);
          setReceivedTransactions(response.receivedTransactions);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
  
      fetchTransaction();
    }, []);
  
    return (
      <StyledGrid>
        <Grid container spacing={4}>
          {/* Left Column: Sent Transactions */}
          <Grid>
            <Title>Sent</Title>
            {sentTransactions.length > 0 ? (
              <TransactionList>
                <TableContainer>
                  <StyledTable>
                    <TableHead>
                      <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Amount</TableHeader>
                        <TableHeader>Currency</TableHeader>
                        <TableHeader>Receiver</TableHeader>
                      </tr>
                    </TableHead>
                    <tbody>
                      {sentTransactions.map((transaction) => (
                        <TableRow key={transaction.TransactionId}>
                          <TableCell>{transaction.TransactionId}</TableCell>
                          <TableCell>{transaction.Amount}</TableCell>
                          <TableCell>{transaction.CurrencyType}</TableCell>
                          <TableCell>{transaction.Name}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </StyledTable>
                </TableContainer>
              </TransactionList>
            ) : (
              <p>No sent transactions found.</p>
            )}
          </Grid>
  
          {/* Right Column: Received Transactions */}
          <Grid>
            <Title>Received</Title>
            {receivedTransactions.length > 0 ? (
              <TransactionList>
                <TableContainer>
                  <StyledTable>
                    <TableHead>
                      <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Amount</TableHeader>
                        <TableHeader>Currency</TableHeader>
                        <TableHeader>Sender</TableHeader>
                      </tr>
                    </TableHead>
                    <tbody>
                      {receivedTransactions.map((transaction) => (
                        <TableRow key={transaction.TransactionId}>
                          <TableCell>{transaction.TransactionId}</TableCell>
                          <TableCell>{transaction.Amount}</TableCell>
                          <TableCell>{transaction.CurrencyType}</TableCell>
                          <TableCell>{transaction.Name}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </StyledTable>
                </TableContainer>
              </TransactionList>
            ) : (
              <p>No received transactions found.</p>
            )}
          </Grid>
        </Grid>
      </StyledGrid>
    );
  };
  
  export default ShowTransaction;
  