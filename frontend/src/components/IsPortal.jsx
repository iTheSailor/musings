import React, { Component } from 'react'
import {
  GridColumn,
  Button,
  Grid,
  Header,
  Segment,
  Portal,
  Container,
  Icon,

} from 'semantic-ui-react'
import PropTypes from 'prop-types'

export default class IsPortal extends Component {
  state = { open: false }

  handleClose = () => this.setState({ open: false })
  handleOpen = () => this.setState({ open: true })

  static propTypes = {
    header: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.string,
    isInverted: PropTypes.bool || false,
    color: PropTypes.string,
  }

  render() {
    const { open } = this.state
    return (
    
      <Grid >
        <GridColumn>
          <Button
            content={this.props.label}
            disabled={open}
            inverted={this.props.isInverted}
            onClick={this.handleOpen}
            color={this.props.color}
            
          />

          <Portal onClose={this.handleClose} open={open}>
            <Segment
              style={{
                position: 'fixed',  // Use fixed positioning
                top: '50%',         // Position the top edge of the segment in the middle of the screen vertically
                left: '50%',        // Position the left edge of the segment in the middle of the screen horizontally
                transform: 'translate(-50%, -50%)', // Shift the segment up by 50% of its height and left by 50% of its width
                zIndex: 1000,           // Set the width to 50% of the screen
                width: '50%',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justify_content: 'center',
              }}
            >
              <Header>
                <Grid  columns={3}>
                <GridColumn align='left'>
                </GridColumn>
                <GridColumn align='middle'>
                {this.props.header}
                </GridColumn>
                <GridColumn align='right'>
                <Icon
                  name='close'
                  onClick={this.handleClose}
                  style={{ cursor: 'pointer'}}
                  color='black'
                />
                </GridColumn>
                </Grid>
              </Header>
              <Container style={{width: '100%', margin:'auto'}}>
                {this.props.children}
              </Container>
              <br />
             
            </Segment>
          </Portal>
        </GridColumn>
      </Grid>
    )
  }
}