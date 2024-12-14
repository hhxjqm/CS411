import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

const mainListItems = [
  { text: 'Groups', icon: <HomeRoundedIcon /> },
  { text: 'Spendings', icon: <AnalyticsRoundedIcon /> },
  { text: 'Transaction', icon: <PeopleRoundedIcon /> },
  { text: 'Currency Exchange', icon: <AssignmentRoundedIcon /> },

];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
];

type MenuContentProps = {
  activeItem: string | null; // 当前激活的菜单项
  setActiveItem: React.Dispatch<React.SetStateAction<string | null>>; // 状态更新函数
};

export default function MenuContent({ activeItem, setActiveItem }: MenuContentProps) {

  const handleItemClick = (text: string) => {
    setActiveItem(text === activeItem ? null : text); // 切换激活状态
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={activeItem === item.text}
              onClick={() => handleItemClick(item.text)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

