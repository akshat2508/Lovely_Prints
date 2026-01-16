import { useState } from "react"
import { PDFDocument } from "pdf-lib"

import {
  createStudentOrder,
  uploadFile,
  attachDocumentToOrder,
} from "../../../services/studentService"

import { startPayment } from "../Payments"
import "../dashboard.css" // reuse existing styles

const URGENCY_FEE = 10

const CreateOrderModal = ({ shop, shopOptions, onClose, onSuccess }) => {
  /* Print config */
  const [paperType, setPaperType] = useState("")
  const [colorMode, setColorMode] = useState("")
  const [finishType, setFinishType] = useState("")
  const [pageCount, setPageCount] = useState(1)
  const [copies, setCopies] = useState(1)
  const [orientation, setOrientation] = useState("portrait")
  const [isUrgent, setIsUrgent] = useState(false)

  /* File */
  const [selectedFile, setSelectedFile] = useState(null)

  /* Submit */
  const [submitting, setSubmitting] = useState(false)

  /* Helpers */
  const selectedPaper = shopOptions?.paper_types?.find(
    (p) => p.id === paperType
  )
  const selectedColor = shopOptions?.color_modes?.find(
    (c) => c.id === colorMode
  )
  const selectedFinish = shopOptions?.finish_types?.find(
    (f) => f.id === finishType
  )

  const totalPrice = (() => {
    if (!selectedPaper) return 0

    const paperPrice = Number(selectedPaper.base_price || 0)
    const colorPrice = Number(selectedColor?.extra_price || 0)
    const finishPrice = Number(selectedFinish?.extra_price || 0)

    const base =
      (paperPrice + colorPrice + finishPrice) *
      Number(pageCount) *
      Number(copies)

    return isUrgent ? base + URGENCY_FEE : base
  })()

  const canSubmit =
    paperType && colorMode && finishType && selectedFile && copies > 0

  const getPdfPageCount = async (file) => {
    const buffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(buffer)
    return pdf.getPageCount()
  }

  /* 🔥 CORE FLOW */
  const handleSubmitAndPay = async () => {
    try {
      setSubmitting(true)

      // 1️⃣ Create order
      const orderRes = await createStudentOrder({
        shop_id: shop.id,
        description: "Print order",
        orientation,
        is_urgent: isUrgent,
      })

      const order = orderRes.data

      // 2️⃣ Upload file
      const uploadRes = await uploadFile(selectedFile)
      const fileKey = uploadRes.data.fileKey

      // 3️⃣ Attach document
      await attachDocumentToOrder(order.id, {
        fileKey,
        fileName: selectedFile.name,
        page_count: pageCount,
        copies,
        paper_type_id: paperType,
        color_mode_id: colorMode,
        finish_type_id: finishType,
      })

      // 4️⃣ Payment
      await startPayment(
        {
          ...order,
          total_price: totalPrice,
        },
        onSuccess
      )
    } catch (err) {
      console.error("Order submission failed", err)
      alert("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">
          Create Order — {shop.shop_name}
        </h2>

        {/* Paper Type */}
        <select
          className="modal-input1"
          value={paperType}
          onChange={(e) => setPaperType(e.target.value)}
        >
          <option value="">Paper Type</option>
          {shopOptions.paper_types.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Color Mode */}
        <select
          className="modal-input1"
          value={colorMode}
          onChange={(e) => setColorMode(e.target.value)}
        >
          <option value="">Color Mode</option>
          {shopOptions.color_modes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Finish Type */}
        <select
          className="modal-input1"
          value={finishType}
          onChange={(e) => setFinishType(e.target.value)}
        >
          <option value="">Finish Type</option>
          {shopOptions.finish_types.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Orientation */}
        <select
          className="modal-input1"
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>

        {/* Page Count */}
        <input
          className="modal-input1"
          type="number"
          value={pageCount}
          readOnly
        />

        {/* Copies */}
        <input
          className="modal-input1"
          type="number"
          min={1}
          value={copies}
          onChange={(e) => setCopies(Number(e.target.value))}
          placeholder="Copies"
        />

        {/* Upload */}
        <label className="upload-box1">
          Upload PDF
          <input
            type="file"
            accept=".pdf"
            onChange={async (e) => {
              const file = e.target.files[0]
              if (!file) return
              setSelectedFile(file)
              try {
                const pages = await getPdfPageCount(file)
                setPageCount(pages)
              } catch {
                alert("Unable to read PDF")
              }
            }}
          />
        </label>

        {/* Urgent */}
        <label className="urgent-toggle">
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-text">Urgent (+₹10)</span>
        </label>

        {/* Price */}
        {selectedPaper && (
          <div className="price-preview">
            <p><strong>Total: ₹{totalPrice}</strong></p>
          </div>
        )}

        {/* Actions */}
        <div className="modal-actions">
          <button
            className="submit-btn1"
            disabled={!canSubmit || submitting}
            onClick={handleSubmitAndPay}
          >
            {submitting ? "Processing..." : "Submit & Pay"}
          </button>

          <button className="cancel-btn1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateOrderModal
