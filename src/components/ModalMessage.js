import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';

export default function ModalMessage(props) {

    return (
        <React.Fragment>
            <Modal open={props.openModal} onClose={() => props.setOpenModal(false)}
                sx={{
                    '&> .MuiModal-backdrop': {
                        bgcolor: '#29292961',
                    }
                }}
            >
                <ModalDialog
                    variant="outlined"
                    role="alertdialog"
                    aria-labelledby="alert-dialog-modal-title"
                    aria-describedby="alert-dialog-modal-description"
                >
                    <Typography
                        id="alert-dialog-modal-title"
                        component="h2"
                        startDecorator={'🎉'}
                    >
                        Game Result!!
                    </Typography>
                    <Divider />
                    <br />
                    <Typography textColor="text.secondary">
                        <Typography component="h3">
                            Player Score: {props.playerScore}
                        </Typography>
                        <br />
                        <Typography component="h3">
                            CPU Score: {props.cpuScore}
                        </Typography>
                        <br />
                        <Typography component="h3">
                            Total Rounds: {props.totalRounds}
                        </Typography>
                    </Typography>
                    <br />
                    <Typography textColor="text.tertiary">
                        {props.playerScore > props.cpuScore &&
                            'Congratulations you won !! 🥳✨'
                        }
                        {props.playerScore < props.cpuScore &&
                            'Better luck next time. 🙂'
                        }
                        {props.playerScore === props.cpuScore &&
                            'Match is draw! Try again. 🫣'
                        }
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
                        <Button variant="solid" color="info" onClick={() => props.setOpenModal(false)}>
                            Close
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}