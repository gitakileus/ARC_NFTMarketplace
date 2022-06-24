import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const socials = [
  [
    { name: 'Telegram', link: 'https://t.me/DepoOfficial' },
    { name: 'Twitter', link: 'https://twitter.com/defi_arc' },
    { name: 'Discord', link: 'https://discord.gg/arcdefi' },
    { name: 'Email', link: 'mailto:contact@arc.market' },
    { name: 'Youtube', link: 'https://www.youtube.com/channel/UC7DxUgUZdN_wrL20DiXRYhw' },
    { name: 'Linkedin', link: 'https://www.linkedin.com/company/arcdefi' },
  ],
  [
    { name: 'Facebook', link: 'https://www.facebook.com/ARC.Market.DeFi' },
    { name: 'Medium', link: 'https://arc-market.medium.com/' },
    { name: 'Reddit', link: 'https://www.reddit.com/r/ARC_Market/' },
    { name: 'Instagram', link: 'https://www.instagram.com/ARC.Market.DeFi/' },
    { name: 'Tiktok', link: 'https://www.tiktok.com/@ARC_Defi' },
  ],
];

export default function ContactUs() {
  const [subject, setSubject] = useState('Partnership');
  const [message, setMessage] = useState('');
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" mb={4}>
          Contact us
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" mb={5}>
          You can reach us directly by sending a message or visiting our social links.
        </Typography>
        <Grid container>
          {socials.map((group, i) => (
            <Grid item xs={6} key={i}>
              {group.map((social, j) => (
                <Box key={j} mb={4}>
                  <Link
                    href={social.link}
                    target="_blank"
                    color="textPrimary"
                    underline="none"
                    display="flex"
                    alignItems="center"
                  >
                    <Box style={{ backgroundColor: 'white', width: 32, height: 32, borderRadius: 15, zIndex: 10 }}>
                      <img
                        src={`/images/socials/${social.name.toLowerCase()}.png`}
                        alt={social.name}
                        width="32px"
                        style={{ borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="caption" ml={2}>
                      {social.name}
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormGroup>
          <FormControlLabel
            labelPlacement="top"
            label="Subject"
            control={
              <Select
                fullWidth
                variant="outlined"
                sx={{ mt: 1 }}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <MenuItem value="Partnership">Partnership</MenuItem>
                <MenuItem value="Question">Question</MenuItem>
              </Select>
            }
            sx={{ alignItems: 'flex-start', mb: 3, mx: 0 }}
          />
          <FormControlLabel
            labelPlacement="top"
            label="Message"
            control={
              <TextField
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                sx={{ mt: 1 }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            }
            sx={{ alignItems: 'flex-start', mb: 3, mx: 0 }}
          />
          <Box>
            <Button
              href={`mailto:contact@arc.market?subject=${subject}&body=${message}`}
              size="large"
              variant="contained"
              sx={{ width: { xs: '100%', md: 'auto' } }}
            >
              Send message
            </Button>
          </Box>
        </FormGroup>
      </Grid>
    </Grid>
  );
}
