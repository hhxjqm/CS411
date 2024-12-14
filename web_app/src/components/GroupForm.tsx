import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { createGroup, joinGroup } from '../request/group'; // Import your group request methods here
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

interface GroupFormProps {
  refreshGroups?: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ refreshGroups }) => {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({
    GroupName: '',
    GroupId: '',
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
      if (!login) {
        setMessage({ text: 'User is not logged in.', type: 'error' });
        setLoading(false);
        return;
      }

      if (mode === 'create') {
        await createGroup({ GroupName: formData.GroupName, CreatedBy: login.UserId });
        setMessage({ text: 'Group created successfully!', type: 'success' });
      } else if (mode === 'join') {
        // Assuming you have a joinGroup method
        await joinGroup(Number(formData.GroupId), login.UserId);
        setMessage({ text: 'Successfully joined the group!', type: 'success' });
      }

      setFormData({ GroupName: '', GroupId: '' });
      if (refreshGroups) refreshGroups();
    } catch (error) {
      console.error('Error performing group operation:', error);
      setMessage({ text: 'Operation failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>Group Form</Title>
      <FieldContainer>
        <TextField
          select
          fullWidth
          label="Select Operation"
          value={mode}
          onChange={(e) => setMode(e.target.value as 'create' | 'join')}
        >
          <MenuItem value="create">Create Group</MenuItem>
          <MenuItem value="join">Join Group</MenuItem>
        </TextField>
      </FieldContainer>
      <form onSubmit={handleSubmit}>
        {mode === 'create' && (
          <FieldContainer>
            <TextField
              fullWidth
              name="GroupName"
              label="Group Name"
              value={formData.GroupName}
              onChange={handleInputChange}
              required
            />
          </FieldContainer>
        )}
        {mode === 'join' && (
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

export default GroupForm;
