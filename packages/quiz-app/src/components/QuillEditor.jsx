import hljs from 'highlight.js'
import { useState } from 'react'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css' // import the styles

hljs.configure({
  languages: ['javascript', 'ruby', 'python', 'rust', 'java', 'sql']
})

const QuillEditor = ({ question }) => {
  const [content, setContent] = useState(question || '')

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
        ['clean']
      ]
    }
  }

  const handleChange = value => {
    setContent(value)
  }

  return (
    <ReactQuill value={content} onChange={handleChange} modules={modules} />
  )
}

export default QuillEditor
