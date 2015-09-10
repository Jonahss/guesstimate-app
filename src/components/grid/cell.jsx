'use strict';

import React from 'react'
import $ from 'jquery'

let GRID_ITEM_FOCUS_CLASS = '.grid-item-focus'

class Cell extends React.Component {
  componentDidMount = () => {
    this._focus()
  }
  componentDidUpdate = (prevProps, _) => {
    if (prevProps.isSelected == false){
      this._focus()
    }
  }
  _focus = () => {
    if (this.props.isSelected){
     if (!this.props.item) {
       React.findDOMNode(this).focus()
     } else {
       $(GRID_ITEM_FOCUS_CLASS).focus();
     }
    }
  }
  _handleKeyPress = (e) => {
    this.props.gridKeyPress(e)
  }
  _handleClick = () => {
    console.log(this.props)
    if (!this.props.isSelected) {
      this.props.handleSelect(this.props.location)
    } else {
      if (!this.props.item) {
        this.props.onAddItem(this.props.location)
      }
      this.props.handleSelect(this.props.location)
    }
  }
  _cellType = () => {
    if (this.props.item) {
      return React.cloneElement(this.props.item, {isSelected: this.props.isSelected, gridKeyPress: this.props.gridKeyPress})
    } else {
      return ('')
    }
  }
  _classes = () => {
    let classes = 'cell'
    classes += (this.props.item ? ' full' : ' empty')
    classes += (this.props.isSelected ? ' selected' : ' nonSelected')
    return classes
  }
  render = () => {
    return (
      <div tabIndex='0' onClick={this._handleClick} onKeyDown={this._handleKeyPress} className={this._classes()}>
        {this._cellType()}
      </div>
    )
  }
}

export default Cell