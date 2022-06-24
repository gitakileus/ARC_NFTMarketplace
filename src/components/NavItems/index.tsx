import { Button, Link, Menu, MenuItem, styled } from '@mui/material';
import { NAV_ITEMS } from 'config/navs';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from 'state/hooks';

interface INavItems {
  header?: boolean;
  toggleDrawer: () => void;
}

const StyledMenuItem = styled(MenuItem)({
  '&:hover': {
    borderRadius: '10px',
  },
});

// const CollectionOfferMade = ({ isOpen, onDismiss, collection, offerPrice, offerEndDate }: INavItems) => {
export const NavItems: React.FC<{ header?: boolean; toggleDrawer: () => void }> = ({
  header,
  toggleDrawer,
}: INavItems) => {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      {NAV_ITEMS.map((item, index) => (
        <StyledMenuItem
          key={index}
          onClick={() => {
            navigate(item.path);
            if (!header) toggleDrawer();
          }}
          sx={{
            color: pathname === item.path && header ? '#007AFF' : '#fff',
            display: 'block',
            cursor: 'pointer',
            p: 2,
            fontWeight: pathname === item.path && header ? 600 : 500,
          }}
        >
          {item.title}
        </StyledMenuItem>
      ))}
      {isAuthenticated && (
        <div>
          <Button variant="text" sx={{ p: 2, textTransform: 'none', color: '#fff' }} onClick={handleClick}>
            Create
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate('/items/create');
                if (!header) toggleDrawer();
              }}
            >
              Item
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate('/collections/create');
                if (!header) toggleDrawer();
              }}
            >
              Collection
            </MenuItem>
          </Menu>
        </div>
      )}
    </>
  );
};

export default NavItems;
