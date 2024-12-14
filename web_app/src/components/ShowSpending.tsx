import  { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import UserContext from '../context/UserContext';
import { getSpending, type Spending} from '../request/spending';
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

const SpendingList = styled.ul`
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


const ShowSpending = () => {
    const [sentSpendings, setSentSpendings] = useState<(Spending & User)[]>([]);
    const [receivedSpendings, setReceivedSpendings] = useState<(Spending & User)[]>([]);
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
  
    if (!login) {
      navigate('/login');
      return null;
    }
  
    useEffect(() => {
      const fetchSpending = async () => {
        try {
          const response = await getSpending(login.UserId);
          console.log('Fetched Spending Response:', response);
  
          setSentSpendings(response.sendSpending);
          setReceivedSpendings(response.receivedSpending);
        } catch (error) {
          console.error('Error fetching Spendings:', error);
        }
      };
  
      fetchSpending();
    }, []);
  
    return (
      <StyledGrid>
        <Grid container spacing={4}>
          {/* Left Column: Sent Spendings */}
          <Grid>
            <Title>Sent</Title>
            {sentSpendings.length > 0 ? (
              <SpendingList>
                <TableContainer>
                  <StyledTable>
                    <TableHead>
                      <tr>
                        <TableHeader>SpendingID</TableHeader>
                        <TableHeader>Amount</TableHeader>
                        <TableHeader>Currency</TableHeader>
                        <TableHeader>GroupID</TableHeader>
                      </tr>
                    </TableHead>
                    <tbody>
                      {sentSpendings.map((Spending) => (
                        <TableRow key={Spending.SpendingId}>
                          <TableCell>{Spending.SpendingId}</TableCell>
                          <TableCell>{Spending.Amount}</TableCell>
                          <TableCell>{Spending.CurrencyType}</TableCell>
                          <TableCell>{Spending.GroupId}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </StyledTable>
                </TableContainer>
              </SpendingList>
            ) : (
              <p>No sent Spendings found.</p>
            )}
          </Grid>
  
          {/* Right Column: Received Spendings */}
          <Grid>
            <Title>Received</Title>
            {receivedSpendings.length > 0 ? (
              <SpendingList>
                <TableContainer>
                  <StyledTable>
                    <TableHead>
                      <tr>
                        <TableHeader>SpendingID</TableHeader>
                        <TableHeader>Amount</TableHeader>
                        <TableHeader>Currency</TableHeader>
                        <TableHeader>GroupID</TableHeader>
                      </tr>
                    </TableHead>
                    <tbody>
                      {receivedSpendings.map((Spending) => (
                        <TableRow key={Spending.SpendingId}>
                          <TableCell>{Spending.SpendingId}</TableCell>
                          <TableCell>{Spending.Amount}</TableCell>
                          <TableCell>{Spending.CurrencyType}</TableCell>
                          <TableCell>{Spending.GroupId}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </StyledTable>
                </TableContainer>
              </SpendingList>
            ) : (
              <p>No received Spendings found.</p>
            )}
          </Grid>
        </Grid>
      </StyledGrid>
    );
  };
  
  export default ShowSpending;
  