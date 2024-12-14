import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { getExchangeRate } from '../request/exchange';

const FormContainer = styled(Box)`
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 600px;
  margin: 20px auto;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const FieldContainer = styled(Box)`
  margin-bottom: 20px;
`;

// export interface ExchangeRequest {
//     source: string; // Source currency in ISO format
//     target: string; // Target currency in ISO format
// }

const ExchangeForm = () => {
  const [formData, setFormData] = useState({
    source: '',
    target: '',
    amount: '',
  });

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { source, target, amount } = formData;

      if (!source || !target || !amount || isNaN(parseFloat(amount))) {
        setMessage({ text: 'Please enter valid input for all fields.', type: 'error' });
        return;
      }
    //   const data: ExchangeRequest = { source, target };
      const exchangeRate = await getExchangeRate({ source, target });
      const convertedAmount = parseFloat(amount) * exchangeRate.Rate;

      setResult(`Converted Amount: ${convertedAmount.toFixed(2)} ${target}`);
      setMessage({ text: 'Exchange rate retrieved successfully!', type: 'success' });
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      setMessage({ text: 'Failed to fetch exchange rate. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>Currency Exchange</Title>
      <form onSubmit={handleSubmit}>
        <FieldContainer>
          <TextField
            fullWidth
            name="source"
            label="Source Currency (ISO Code)"
            value={formData.source}
            onChange={handleInputChange}
            required
          />
        </FieldContainer>
        <FieldContainer>
          <TextField
            fullWidth
            name="target"
            label="Target Currency (ISO Code)"
            value={formData.target}
            onChange={handleInputChange}
            required
          />
        </FieldContainer>
        <FieldContainer>
          <TextField
            fullWidth
            name="amount"
            label="Amount in Source Currency"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </FieldContainer>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </Button>
      </form>

      {/* Result Display */}
      {result && (
        <FieldContainer>
          <Alert severity="info">{result}</Alert>
        </FieldContainer>
      )}

      {/* Success/Error Message */}
      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
      >
        <Alert onClose={() => setMessage(null)} severity={message?.type}>
          {message?.text}
        </Alert>
      </Snackbar>
    </FormContainer>
  );
};

export default ExchangeForm;
