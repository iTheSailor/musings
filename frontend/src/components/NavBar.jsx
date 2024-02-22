import React, { Component } from 'react';
import { Menu, Segment, Button, Container, Icon, Sidebar } from 'semantic-ui-react';
import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types';
import { InView } from 'react-intersection-observer'
import HomepageHeading from '../components/HomepageHeading.jsx'; // Assuming you've moved this into its own file


const { MediaContextProvider, Media } = createMedia({
    breakpoints: {
      mobile: 0,
      tablet: 768,
      computer: 1024,
    },
  })

class DesktopContainer extends Component {
    state = {};

    toggleFixedMenu = (inView) => this.setState({ fixed: !inView });

    render() {
        const { children } = this.props;
        const { fixed } = this.state;

        return (
            <Media greaterThan='mobile'>
                <InView onChange={this.toggleFixedMenu}>
                <Segment
                    inverted
                    textAlign='center'
                    style={{ minHeight: 700, padding: '1em 0em' }}
                    vertical
                >
                    <Menu
                        fixed={fixed ? 'top' : null}
                        inverted={!fixed}
                        pointing={!fixed}
                        secondary={!fixed}
                        size='large'
                    >
                        <Container>
                            <Menu.Item as='a' href="/" active>
                                Home
                            </Menu.Item>
                            <Menu.Item as='a' href="/apps/forecast">Work</Menu.Item>
                            <Menu.Item as='a'>Company</Menu.Item>
                            <Menu.Item as='a'>Careers</Menu.Item>
                            <Menu.Item position='right'>
                                <Button as='a' inverted={!fixed}>
                                    Log in
                                </Button>
                                <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                                    Sign Up
                                </Button>
                            </Menu.Item>
                        </Container>
                    </Menu>
                    <HomepageHeading />
                </Segment>
                {children}
                </InView>
            </Media>
        );
    }
}

DesktopContainer.propTypes = {
    children: PropTypes.node,
};

class MobileContainer extends Component {
    state = {};

    handleSidebarHide = () => this.setState({ sidebarOpened: false });

    handleToggle = () => this.setState({ sidebarOpened: true });

    render() {
        const { children } = this.props;
        const { sidebarOpened } = this.state;

        return (
            <Media as={Sidebar.Pushable} at='mobile'>
                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        inverted
                        onHide={this.handleSidebarHide}
                        vertical
                        visible={sidebarOpened}
                    >
                        <Menu.Item as='a' active>
                            Home
                        </Menu.Item>
                        <Menu.Item as='a'>Work</Menu.Item>
                        <Menu.Item as='a'>Company</Menu.Item>
                        <Menu.Item as='a'>Careers</Menu.Item>
                        <Menu.Item as='a'>Log in</Menu.Item>
                        <Menu.Item as='a'>Sign Up</Menu.Item>
                    </Sidebar>

                    <Sidebar.Pusher dimmed={sidebarOpened}>
                        <Segment
                            inverted
                            textAlign='center'
                            style={{ minHeight: 350, padding: '1em 0em' }}
                            vertical
                        >
                            <Container>
                                <Menu inverted pointing secondary size='large'>
                                    <Menu.Item onClick={this.handleToggle}>
                                        <Icon name='sidebar' />
                                    </Menu.Item>
                                    <Menu.Item position='right'>
                                        <Button as='a' inverted>
                                            Log in
                                        </Button>
                                        <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
                                            Sign Up
                                        </Button>
                                    </Menu.Item>
                                </Menu>
                            </Container>
                            <HomepageHeading mobile />
                        </Segment>
                        {children}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </Media>
        );
    }
}

MobileContainer.propTypes = {
    children: PropTypes.node,
};

const ResponsiveNavbar = ({ children }) => (
    <MediaContextProvider>
        <DesktopContainer>{children}</DesktopContainer>
        <MobileContainer>{children}</MobileContainer>
    </MediaContextProvider>
);

ResponsiveNavbar.propTypes = {
    children: PropTypes.node,
};

export default ResponsiveNavbar;
