import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// https://codesandbox.io/s/qv5m74l80w?file=/src/index.tsx

const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: ["small", false, "large", "huge"] }, { color: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
          { align: [] }
        ],
        ["link", "image", "video"],
        ["clean"]
      ]
    },
    clipboard: { matchVisual: false }
};

const defaultvalue = `<ul><li>Date: 5/14/2021 9:29:02 PM</li><li><span style=\"color:red;\">sup_name</span> changes from <span style=\"color:red;\">null</span> to <span style=\"color:red;\">Loa Bluetooth LANEX W05 Chính hãng</span></li>\n<li><span style=\"color:red;\">sup_price</span> changes from <span style=\"color:red;\">null</span> to <span style=\"color:red;\">160000</span></li>\n<li><span style=\"color:red;\">sup_stock</span> changes from <span style=\"color:red;\">null</span> to <span style=\"color:red;\">1</span></li>\n<li><span style=\"color:red;\">sup_warranty</span> changes from <span style=\"color:red;\">null</span> to <span style=\"color:red;\">12T</span></li></ul>----------<ul><li>Date: 5/14/2021 9:29:02 PM</li><li><span style=\"color:red;\">sup_name</span> changes from <span style=\"color:red;\">null</span> to <span style=\"color:red;\">Loa Bluetooth LANEX W05 Chính hãng</span></li>\n<li><span style=\"color:red;\">sup_price</span> changes from <span style=\"color:red;\">null</span> to <span style=\"color:red;\">160000</span></li>\n<li><span style=\"color:red;\">sup_stock</span> changes from <span style=\"color:red;\">null</span> to <span style=\"color:red;\">1</span></li>\n<li><span style=\"color:red;\">sup_warranty</span> changes from <span style=\"color:red;\">null</span> to <span style=\"color:red;\">12T</span></li></ul>`;

function TextEditor (props) {
    const [text, setText] = useState(defaultvalue);
    return (
        <ReactQuill
            value={text}
            onChange={(value) => {
                console.log(value);
                setText(value);
            }}
            modules={modules}
        />
    )
};

export default TextEditor;