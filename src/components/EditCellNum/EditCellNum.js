import React, {PureComponent} from 'react';
import {InputNumber, Icon, } from 'antd';
import styles from './EditCellNum.less';

export default class EditCellNum extends React.Component {

  state = {
    edit_val:'',//编辑的值
    editable: false,
  }
  componentWillReceiveProps(props){
    this.setState({
      editable: false,
    })
  }
  handleChange = (e) => {
    this.setState({edit_val:e});
  }
  save = () => {
    const {edit_val} = this.state;
    if(edit_val){
      this.props.onChange(edit_val);
    }else{
      this.setState({editable: false, })
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { editable,edit_val } = this.state;
    const {min,max,value} = this.props
    return (
        <div className={styles.editable_cell}>
          {
            editable ?
                <div className={styles.editable_cell_input_wrapper}>
                  <InputNumber
                      min={min}
                      max={max}
                      value={edit_val==''?value:edit_val}
                      onChange={this.handleChange}
                      onPressEnter={this.check}
                  />
                  <Icon
                      type="check"
                      className={styles.editable_cell_icon_check}
                      onClick={this.save}
                  />
                </div>
                :
                <div className={styles.editable_cell_text_wrapper}>
                  {value || 0}
                  <Icon
                      type="edit"
                      className={styles.editable_cell_icon}
                      onClick={this.edit}
                  />
                </div>
          }
        </div>
    );
  }
}
