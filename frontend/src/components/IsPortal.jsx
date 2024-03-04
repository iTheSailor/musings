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
import { useState } from 'react'

const IsPortal = ({ header, children, label, isInverted=false, color }) => {
  IsPortal.propTypes = {
    header: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    isInverted: PropTypes.bool,
    color: PropTypes.string,
  }

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const enhancedChildren = React.Children.map(children, child => 
    React.cloneElement(child, { handleClose })
  );

  return (
    
      <Grid >
        <GridColumn>
          <Button
            content={label}
            disabled={open}
            inverted={isInverted}
            onClick={handleOpen}
            color={color}
            
          />

          <Portal onClose={handleClose} open={open}>
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
                {header}
                </GridColumn>
                <GridColumn align='right'>
                <Icon
                  name='close'
                  onClick={handleClose}
                  style={{ cursor: 'pointer'}}
                  color='black'
                />
                </GridColumn>
                </Grid>
              </Header>
              <Container style={{width: '100%', margin:'auto'}}>
                {enhancedChildren}
              </Container>
              <br />
             
            </Segment>
          </Portal>
        </GridColumn>
      </Grid>
    )
  }

export default IsPortal