import { ExpandMore, FormatListBulleted } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, CardMedia, Divider, Typography } from '@mui/material';
import { INFT } from 'interfaces/INFT';
import { INFTCollection } from 'interfaces/INFTCollection';
import _, { isArray } from 'lodash';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { shortenAddress } from 'utils';

type IProps = {
  collection: INFTCollection;
  nft: INFT;
};

interface IKeys {
  title: string;
  name: string;
}

const About = ({ collection, nft }: IProps) => {
  const navigate = useNavigate();
  const [sizeWidth, setSizeWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setSizeWidth(window.innerWidth);
  }, [window.innerWidth]);

  useEffect(() => {
    setIsMobile(sizeWidth < 768);
  }, [sizeWidth]);

  return (
    <>
      <Typography variant="subtitle2" pt={3} pb={5}>
        {nft.description}
      </Typography>
      <Accordion
        sx={{ background: 'transparent', border: 1, borderColor: 'grey.900', borderRadius: 2 }}
        defaultExpanded
      >
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel2a-content" id="panel2a-header">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormatListBulleted />
            <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>&nbsp; Properties</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          {nft.properties &&
            isArray(nft.properties) &&
            nft.properties.map((val: IKeys) => (
              <Box
                mb={3}
                display="flex"
                justifyContent="space-between"
                key={val.title}
                sx={{ border: 1, borderColor: 'grey.800', borderRadius: 2, padding: 2 }}
              >
                <Typography
                  color="text.secondary"
                  textTransform="capitalize"
                  sx={{ fontWeight: 400, fontSize: '14px' }}
                >
                  {val.title}: <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>{val.name}</span>
                </Typography>
                <Typography
                  style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() =>
                    _.isEmpty(collection.url)
                      ? navigate(`/collections/${collection.url}`)
                      : navigate(`/collections/id/${collection._id}`)
                  }
                >
                  {!isMobile && (
                    <Typography variant="subtitle2" fontWeight={700}>
                      View Others
                    </Typography>
                  )}
                </Typography>
              </Box>
            ))}
          <Box sx={{ background: '#1E1E1E', borderRadius: '10px', p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography color="textSecondary" fontSize={14} sx={{ fontWeight: 500 }}>
                Token ID
              </Typography>
              <Typography fontWeight={700} fontSize={14}>
                {nft.index}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography color="text.secondary" fontWeight={500} fontSize={14}>
                Contract
              </Typography>
              <Link
                to="/"
                style={{ color: '#007AFF', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}
                onClick={() => {
                  window.open('https://etherscan.io/address/' + nft.collection);
                }}
              >
                {shortenAddress(nft.collection)}
              </Link>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography color="text.secondary" fontSize={14} fontWeight={500}>
                Blockchain
              </Typography>
              <Typography fontWeight={700} fontSize={14}>
                Ethereum
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography color="text.secondary" fontSize={14}>
                Token standard
              </Typography>
              <Typography fontWeight={600} fontSize={14}>
                {nft.tokenType}
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ minHeight: 60 }}>
              <Typography color="text.secondary" fontSize={14}>
                Creator royalties
              </Typography>
              <Typography fontWeight={600} fontSize={14}>
                {nft.creatorEarning ? nft.creatorEarning : '0'} %
              </Typography>
            </Box>
            {nft.lockContent && (
              <>
                <Divider sx={{ mb: 3 }} />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography color="text.secondary" fontSize={14}>
                    Unlockable content included with this NFT item
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default About;
