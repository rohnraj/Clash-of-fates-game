import React from 'react'
import './loadingState.css'
import TimerIcon from '@mui/icons-material/Timer';

export default function LoadingState() {
    return (
        <div className='loading-body'>
            <div className="smart-glass">
                <h2 className='loading-title'>ROCK PAPER SCISSORS</h2>
                <br />
                <div className="logo">
                    <div className="circle">
                        <div className="circle">
                            <div className="circle">
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="icon-hold">
                            <TimerIcon sx={{ color: 'white', height: '100%', width: '100%' }} />
                        </div>
                    </div>
                </div>
                <br />
                <div className="loading-text">
                    Loading...
                </div>
            </div>
        </div>
    )
}
