import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareIcon from '@mui/icons-material/Share';

const actions = [
    { icon: <InstagramIcon />, name: 'Instagram', url: 'https://www.instagram.com/urstrulysatyam_/' },
    { icon: <GitHubIcon />, name: 'GitHub', url: 'https://github.com/SatyamNagar/' },
    { icon: <LinkedInIcon />, name: 'LinkedIn', url: 'https://www.linkedin.com/in/satyamnagar/' },
];

export default function SocialMedia() {
    return (
        <Box sx={{ position: 'fixed', bottom: 2, right: 2, height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
            <SpeedDial
                ariaLabel="Social Links"
                sx={{
                    position: 'absolute', bottom: 16, right: 16,
                    '&>button': { bgcolor: '#151515' },
                    '&>button:hover': { bgcolor: '#151515' },
                }}
                icon={<ShareIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        onClick={() => window.open(action.url, '_blank')}
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}