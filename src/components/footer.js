import { Component } from "react";
import { Stack, Link, Box } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";

class Linker extends Component {
    render() {
        return (
            <Link component={RouterLink} to={this.props.href} underline="hover" color="white">
                {this.props.text}
            </Link>
        )
    }
}

class Footer extends Component {
    render() {
        const linkArr1 = [
            { text: 'Shipping & Returns', href: '#' },
            { text: 'Store Policy', href: '#' },
            { text: 'Help Center', href: '#' }];
        const linkArr2 = [
            { text: 'How to sell goods using Agora', href: '#' },
            { text: 'What is a crypto wallet?', href: '#' },
            { text: 'What is cryptocurrency?', href: '#' }];
        const linkArr3 = [
            { text: 'Github', href: '/Source' }];
        return (
            <Stack>
                <Box sx={{ bgcolor: '#121212', height: 100, padding: 5 }}>
                    <Stack direction="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        spacing={2}>
                        <Stack spacing={2}>
                            {linkArr1.map((l, k) => {
                                return <Linker key={k} text={l.text} href={l.href} />
                            })}
                        </Stack>
                        <Stack spacing={2}>
                            {linkArr2.map((l, k) => {
                                return <Linker key={k} text={l.text} href={l.href} />
                            })}
                        </Stack>
                        <Stack spacing={2}>
                            {linkArr3.map((l, k) => {
                                return <Linker key={k} text={l.text} href={l.href} />
                            })}
                        </Stack>
                    </Stack>
                </Box>
                <Box display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={30} sx={{ bgcolor: '#757575', typography: 'caption' }}>
                    @2023 Agora Company
                </Box>
            </Stack >
        )
    }
}

export default Footer