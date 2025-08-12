import { Modal } from "react-bootstrap";

const RefundModal = ({
  show,
  handleClose,
  handleRefund,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Refund Method</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div>
            <label>
              <input
                type="radio"
                value="WALLET"
                checked={selectedOption === "WALLET"}
                onChange={() => setSelectedOption("WALLET")}
              />
              WALLET
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                value="ACCOUNT"
                checked={selectedOption === "ACCOUNT"}
                onChange={() => setSelectedOption("ACCOUNT")}
              />
              ACCOUNT
            </label>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-theme mt-3" onClick={handleClose}>
          Close
        </button>
        <button
          className="btn btn-theme mt-3"
          onClick={handleRefund}
          disabled={!selectedOption}
        >
          Confirm Refund
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default RefundModal;
