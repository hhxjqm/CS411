import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import UserContext from "../context/UserContext";
import { getGroups, type Group } from "../request/group";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const StyledGrid = styled(Box)`
  padding: 50px;
  background-color: #d2d2d0;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;

const GroupList = styled.ul`
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

const ShowGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  if (!login) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups(login.UserId);
        const groupsArray = Array.isArray(response) ? response : [response];
        setGroups(groupsArray);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <StyledGrid>
      <Title>Current Groups</Title>
      {groups.length > 0 ? (
        <GroupList>
          <StyledTable>
            <TableHead>
              <tr>
                <TableHeader>Group ID</TableHeader>
                <TableHeader>Group Name</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              {groups.map((g) => (
                <TableRow key={g.GroupId}>
                  <TableCell>{g.GroupId}</TableCell>
                  <TableCell>{g.GroupName}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </GroupList>
      ) : (
        <p>You are not part of any groups.</p>
      )}
    </StyledGrid>
  );
};

export default ShowGroups;
