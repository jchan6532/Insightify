import { MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

type ItemProps = {
  title: string;
  to: string;
  icon: React.ReactNode;
  active: boolean;
};

export default function Item({ title, to, icon, active }: ItemProps) {
  return (
    <MenuItem
      active={active}
      style={{}}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
}
