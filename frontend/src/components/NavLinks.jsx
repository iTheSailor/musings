import React from 'react'
import {
  DropdownMenu,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
  MenuItem,
  Dropdown,

} from 'semantic-ui-react'

const NavDropdown = () => (
<>
    <MenuItem className='link item' href='/'>Home</MenuItem>
    <Dropdown text='Apps' pointing className='link item'>
      <DropdownMenu>
        <DropdownHeader>Apps</DropdownHeader>
        <DropdownItem href='/apps/forecast'>Forecast</DropdownItem>
        <DropdownItem href='/apps/sudoku'>Sudoku</DropdownItem>
        <DropdownItem href='/apps/to-do'>To-Do List</DropdownItem>
        <DropdownDivider />
        <DropdownHeader>Docs</DropdownHeader>
        <DropdownItem>Forecast</DropdownItem>
        <DropdownItem>Sudoku</DropdownItem>
        <DropdownItem>To-Do List</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <MenuItem>Forums</MenuItem>
    <MenuItem>Contact Us</MenuItem>
    </>
)

export default NavDropdown
