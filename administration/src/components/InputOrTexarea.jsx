function InputOrTextarea (props) {
    if (props.component_type === "input") {
        return <input {...props} />
    };
    if (props.component_type === "textarea") {
        return <textarea {...props} />
    };
    return null;
}

export default InputOrTextarea;