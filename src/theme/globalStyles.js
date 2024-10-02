// @mui
import {GlobalStyles as MUIGlobalStyles} from '@mui/material';

// ----------------------------------------------------------------------

export default function GlobalStyles() {
    const inputGlobalStyles = (
        <MUIGlobalStyles
            styles={{
                '*': {
                    boxSizing: 'border-box',
                },
                html: {
                    margin: 0,
                    padding: 0,
                    width: '100%',
                    height: '100%',
                    WebkitOverflowScrolling: 'touch',
                },
                body: {
                    margin: 0,
                    padding: 0,
                    width: '100%',
                    height: '100%',
                },
                '#root': {
                    width: '100%',
                    height: '100%',
                },
                input: {
                    '&[type=number]': {
                        MozAppearance: 'textfield',
                        '&::-webkit-outer-spin-button': {
                            margin: 0,
                            WebkitAppearance: 'none',
                        },
                        '&::-webkit-inner-spin-button': {
                            margin: 0,
                            WebkitAppearance: 'none',
                        },
                    },
                },
                img: {
                    display: 'block',
                    maxWidth: '100%',
                },
                ul: {
                    margin: 0,
                    padding: 0,
                },
                '.rotationAnimate': {
                    animation: "spin 2s linear infinite",
                },
                "@keyframes spin": {
                    "0%": {
                        transform: "rotate(0deg)",
                    },
                    "100%": {
                        transform: "rotate(360deg)",
                    },
                },
            }}
        />
    );

    return inputGlobalStyles;
}
