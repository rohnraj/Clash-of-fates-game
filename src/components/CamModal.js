import * as React from 'react';
import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Typography from '@mui/joy/Typography';

export default function CamModal(props) {

    return (
        <React.Fragment>
            <Modal open={props.askCamPermission}
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
                        startDecorator={<WarningRoundedIcon />}
                    >
                        Alert : Camera Permission Denied
                    </Typography>
                    <Divider />
                    <br />
                    <Typography textColor="text.secondary">
                        <Typography component="h3">
                            It may be happening because of the following reasons:
                        </Typography>
                        <br />
                        <Typography component="ul" textColor="text.tertiary">
                            <Typography component="li">
                                1. Another app might currently be using the camera.
                            </Typography>
                            <br />
                            <Typography component="li">
                                2. You denied or block the camera access permission that was initially asked by the browser.
                            </Typography>
                            <br />
                            <Typography component="li">
                                3. Your device does not have a camera.
                            </Typography>
                        </Typography>
                        <br /><br />
                        <Typography component="h3">
                            Some possible solutions:
                        </Typography>
                        <br />
                        <Typography component="ul" textColor="text.tertiary">
                            <Typography component="li">
                                1. Check if you granted the initial permission by following these steps:
                            </Typography>
                            <br />
                            <Typography component="li" pl={2}>
                                ◾ Click view site information icon i.e.(🔒or ℹ️)
                            </Typography>
                            <br />
                            <Typography component="li" pl={2}>
                                ◾ If the camera permission is denied then turn it on and refresh the page.
                            </Typography>
                            <br />
                            <Typography component="li" pl={2}>
                                ◾ If you change browser permissions then you must refresh the page to see the changes.
                            </Typography>
                            <br /><br />
                            <Typography component="li">
                                2. Check and close other apps if they are currently using the camera.
                            </Typography>
                            <br />
                            <Typography component="li">
                                3. Try opening the link in incognito window.
                            </Typography>
                        </Typography>
                    </Typography>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}