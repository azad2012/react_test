import React from 'react'
import ReactQuill from 'react-quill'; // ES6
require('react-quill/dist/quill.snow.css'); // CommonJS
require('react-quill/dist/quill.bubble.css'); // CommonJS


function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
}
const CustomButton = () => <span className="octicon octicon-star" />;

/*
* Custom toolbar component including insertStar button and dropdowns
*/
const CustomToolbar = (props) => (
  <div id="toolbar">
      <select className="ql-size">
          <option value="" >متوسط</option>
          <option  value="small"> کوچک</option>
          <option  value="large">بزرگ</option>
          <option  value="huge">خیلی بزرگ</option>
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
      <button className="" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <button className="ql-direction"></button>
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
      <button onClick={props.customAction}
              type="button"
              className="quick-text-btn">
          متن سریع
      </button>
      {/* <button className="ql-insertStar">
          < CustomButton />
      </button> */}
  </div>
);
export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' } // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(value) {
    this.setState({ text: value })
  }

    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'},{'align':['center',false,'right','justify']}],
          ['link', 'image'],
          [{'size':['small',false,'huge',]}],
          ['clean'],[{'color':["#000000", "#e60000", "#ff9900"]}]
        ],
        clipboard:{'matchVisual': false}
      };
    
    formats = [
    'header',
    'bold', 'italic', 'underline','size','strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image','align','color'
    ];
  insertStar = (cursorPosition,text)=>{
    let quill  =this.reactQuillRef.getEditor();
    quill.insertText(cursorPosition,text);
    quill.setSelection(cursorPosition);
}
  render() {
    return (
      <ReactQuill
        modules={this.modules}
        formats={this.formats}
        theme="snow" value={this.state.text}
        onChange={this.handleChange} 
      />
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

/*
* Quill editor formats
* See https://quilljs.com/docs/formats/
*/
Editor.formats = [
  'header','size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image','align','color'
  ];