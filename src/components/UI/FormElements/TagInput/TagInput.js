import React, {Component} from 'react'
import TagsInput from 'react-tagsinput'
import classes from './TagInput.module.css'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
 
class TagInput extends Component {

  render() {
    return <div className={classes.spacing}>
      <span>{this.props.label}</span>
      <div className={classes.inputContainer}>
      <TagsInput inputProps={{placeholder:""}} value={this.props.tagValues} onChange={this.props.onTagChange} />
      </div>
      </div>
  }
}

export default TagInput