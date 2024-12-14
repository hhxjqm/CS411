import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { createSpending, updateSpending, deleteSpending } from '../request/spending';
import { type SpendingCreation, type SpendingUpdate} from '../request/spending';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import UserContext from '../context/UserContext';

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

const SpendingForm = ({ refreshSpendings }: { refreshSpendings: () => void}) => {
  const [mode, setMode] = useState<'create' | 'update' | 'delete'>('create');
  const { login } = useContext(UserContext);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    SpendingId: '',
    CurrencyType: '',
    Category: '',
    GroupId: '',
    Amount: '',
  });

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
      if (mode === 'create') {
        const createData: SpendingCreation = {
          CurrencyType: formData.CurrencyType,
          Amount: Number(formData.Amount),
          Category: formData.Category,
          GroupId: Number(formData.GroupId),
        }
        await createSpending(createData);
        setMessage({ text: 'Spending created successfully!', type: 'success' });
      } else if (mode === 'update') {
        const updateData: SpendingUpdate = {
          CurrencyType: formData.CurrencyType,
          Amount: Number(formData.Amount),
          SenderId: (login?.UserId ?? 0).toString(),
          Date: getCurrentDate(),
        };
        await updateSpending(Number(formData.SpendingId), updateData);
        setMessage({ text: 'Spending updated successfully!', type: 'success' });
      } else if (mode === 'delete') {
        await deleteSpending(Number(formData.SpendingId));
        setMessage({ text: 'Spending deleted successfully!', type: 'success' });
      }

      setFormData({
        SpendingId: '',
        CurrencyType: '',
        Category: '',
        GroupId: '',
        Amount: '',
      });
      if (refreshSpendings) {
        refreshSpendings()
      }
    } catch (error) {
      console.error('Error performing spending operation:', error);
      setMessage({ text: 'Operation failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>Spending Form</Title>
      <FieldContainer>
        <TextField
          select
          fullWidth
          label="Select Operation"
          value={mode}
          onChange={(e) => setMode(e.target.value as 'create' | 'update' | 'delete')}
        >
          <MenuItem value="create">Create</MenuItem>
          <MenuItem value="update">Pay</MenuItem>
          <MenuItem value="delete">Delete</MenuItem>
        </TextField>
      </FieldContainer>
      <form onSubmit={handleSubmit}>
        {(mode === 'update' || mode === 'delete') && (
          <FieldContainer>
            <TextField
              fullWidth
              name="SpendingId"
              label="Spending ID"
              value={formData.SpendingId}
              onChange={handleInputChange}
              required
            />
          </FieldContainer>
        )}
        {(mode === 'update' || mode === 'create') && (
          <>
            <FieldContainer>
              <TextField
                fullWidth
                name="Amount"
                label="Amount"
                type="number"
                value={formData.Amount}
                onChange={handleInputChange}
                required
              />
            </FieldContainer>
            <FieldContainer>
              <TextField
                fullWidth
                name="CurrencyType"
                label="Currency Type"
                value={formData.CurrencyType}
                onChange={handleInputChange}
                required
              />
            </FieldContainer>
          </>
        )}

        {mode === 'create' && (
          <>
            <FieldContainer>
              <TextField
                fullWidth
                name="GroupId"
                label="Group ID"
                value={formData.GroupId}
                onChange={handleInputChange}
                required
              />
            </FieldContainer>
            <FieldContainer>
              <TextField
                fullWidth
                name="Category"
                label="Category"
                value={formData.Category}
                onChange={handleInputChange}
                required
              />
            </FieldContainer>
          </>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? 'Processing...' : `Submit ${mode}`}
        </Button>
      </form>
      <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage(null)}>
        <Alert onClose={() => setMessage(null)} severity={message?.type}>
          {message?.text}
        </Alert>
      </Snackbar>
    </FormContainer>
  );
};

export default SpendingForm;
