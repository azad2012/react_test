import React from 'react'
import ReactQuill, { Quill } from 'react-quill'; // ES6
import { heavyWork, AsyncTest } from '../../utility/heavyWork';
import './editor.scss';

require('react-quill/dist/quill.snow.css'); // CommonJS
require('react-quill/dist/quill.bubble.css'); // CommonJS

function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
  this.quill.format('direction', 'rtl');
  this.quill.format('align', 'right');
}
const CustomButton = () => <span className="octicon octicon-star" />;

/*
* Custom toolbar component including insertStar button and dropdowns
*/
const CustomToolbar = (props) => (
  <div id="toolbar">
      {/* <select className="ql-size">
          <option value="" >متوسط</option>
          <option  value="small"> کوچک</option>
          <option  value="large">بزرگ</option>
          <option  value="huge">خیلی بزرگ</option>
      </select> */}

      <select className="ql-size">
        <option value="extra-small">Size 1</option>
        <option value="small">Size 2</option>
        <option value="medium">
          Size 3
        </option>
        <option value="large">Size 4</option>
      </select>
      <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
          <option value="1" />
          <option value="2" />
      </select>
      <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
      </span>
      <span className="ql-formats">

          <select className="ql-color"></select>
      </span>
      <span className="ql-formats">
      <button className="ql-list" value="ordered"></button>
      <button className="ql-direction" value="rtl"></button>
      <button className="ql-list" value="bullet"></button>
      <select defaultValue={""} className="ql-align">
          {/* <option selected></option> */}
          <option value=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
      </select>


    </span>
      <span className="ql-formats">
      <button className="ql-link"></button>
      <button className="ql-image"></button>
    </span>
      {/* <button onClick={props.customAction}
              type="button"
              className="quick-text-btn">
          متن سریع
      </button> */}
      <button className="ql-insertStar">
          < CustomButton />
      </button>
  </div>
);

const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' } // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(value) {
    console.log('**')
    this.setState({ text: value })
  }
  async shouldComponentUpdate(){
      const res = await AsyncTest();
      console.log('**')
      if(res){
        return true;
      }else{
        return false;
      }
  }
  async componentWillMount(){
    // heavyWork()
    const res = await AsyncTest();
    console.log(res)
  }
  componentDidMount(){
    let quill  =this.reactQuillRef.getEditor();
    quill.format('direction', 'rtl');
    quill.format('align', 'center');
    console.log('did mount')  
  }

    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'},{'align':['center',false,'right','justify']}],
          ['link', 'image'],
          [{ 'direction': 'rtl' }],
          [{'size':['small',false,'huge',]}],
          ['clean'],[{'color':["#000000", "#e60000", "#ff9900"]}]
        ],
        clipboard:{'matchVisual': false}
      };
    
    formats = [
    'header',
    'bold', 'italic', 'underline','size','strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image','align','color','direction'
    ];
  insertStar = (cursorPosition,text)=>{
    let quill  =this.reactQuillRef.getEditor();
    quill.insertText(cursorPosition,text);
    
    quill.setSelection(cursorPosition);
    // quill.format('direction', 'rtl');
    // quill.format('align', 'right');
  }



  render() {
    return (
      <>
      <CustomToolbar/>
      <ReactQuill
        ref={(el) => { this.reactQuillRef = el }}
        modules={Editor.modules}
        formats={Editor.formats}
        onChange={this.handleChange}
        theme="snow" value={this.state.text}
        onChange={this.handleChange} 
      />
      </>
    )
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: {
      container: "#toolbar",
      handlers: {
          "insertStar": insertStar,
          'size': function(value){
              if (value){
                  this.quill.format('size',value);
              }else{
                  this.quill.format('size',false);
              }
          }
      }
  },
  clipboard: {
      matchVisual: false,
  }
};
console.log(Editor)
/*
* Quill editor formats
* See https://quilljs.com/docs/formats/
*/

Editor.formats = [
  'header','size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image','align','color','direction'
  ];