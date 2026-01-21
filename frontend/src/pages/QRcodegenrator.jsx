import React from 'react'
import QRCode from 'react-qr-code'


const QRcodegenrator = () => {
    const [value, setValue] = React.useState("");
  return (
      <>
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <QRCode value={value} size={200} />
      </div>
              <div className="mt-4">Please paste the link to get your qrcode</div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter URL or text"
        className="mt-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
    </div>
   
    </>
  )
}

export default QRcodegenrator