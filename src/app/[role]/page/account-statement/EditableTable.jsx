import { Pagination } from "@/app/components/Pagination";
import moment from "moment";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSave } from "react-icons/fa";
import { IoRemoveCircleSharp } from "react-icons/io5";
import { RiAddLargeFill } from "react-icons/ri";
import {
  ADD_ACCOUNT_STATEMENT,
  UPDATE_ACCOUNT_STATEMENT_LIST,
  VIEW_ACCOUNT_STATEMENT,
} from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import {
  restrictAlpha,
  restrictNum1,
  serialNumber,
} from "../../../../../utils/helper";
import { FaDownload, FaPencil } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { MdModeEdit } from "react-icons/md";
const EditableTable = ({
  setPage,
  data,
  getData,
  list,
  page,
  getDataDownloadReport,
}) => {
  const [editIndex, setEditIndex] = useState(null);
  const [tempData, setTempData] = useState({});
  const [hideRow, setHideRow] = useState(false);
  const [newRowData, setNewRowData] = useState({
    date: "",
    type: "",
    number: "",
    amountDr: "",
    amountCr: "",
    // balance: "",
    company: "",
  });

  useEffect(() => {
    getData(page);
  }, [page]);

  // Effect for handling changes in tempData.type
  useEffect(() => {
    if (editIndex !== null) {
      if (tempData.type == "1") {
        setTempData((prevData) => ({ ...prevData, amountDr: "" }));
      } else if (tempData.type == "2") {
        setTempData((prevData) => ({ ...prevData, amountCr: "" }));
      }
    }
  }, [tempData.type, editIndex]);

  // Effect for handling changes in newRowData.type
  useEffect(() => {
    if (newRowData.type == "1") {
      setNewRowData((prevData) => ({ ...prevData, amountDr: "" }));
    } else if (newRowData.type == "2") {
      setNewRowData((prevData) => ({ ...prevData, amountCr: "" }));
    }
  }, [newRowData.type]);

  const handleEditClick = async (id) => {
    setEditIndex(id);
    try {
      const response = await VIEW_ACCOUNT_STATEMENT(id);
      if (response?.status == 200) {
        setTempData(response?.data?.data);
      } else {
        console.error("Failed to update the data", response);
      }
    } catch (error) {
      console.error("Error updating the data", error);
    }
  };

  const saveChanges = async (id) => {
    try {
      const response = await UPDATE_ACCOUNT_STATEMENT_LIST(
        tempData?._id,
        tempData
      );
      if (response?.status == 200) {
        getData(page);
        setEditIndex(null);
        setTempData({});
      } else {
        console.error("Failed to update the data", response);
      }
    } catch (error) {
      toastAlert("error", error?.response?.data?.message);
      console.error("Error updating the data", error);
    }
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setTempData({});
  };

  const addRow = () => {
    setHideRow(true);
    setNewRowData({
      company: list?.company,
      accountType: list?.accountType,
      date: "",
      type: "",
      number: "",
      paymentType: "",
      amountDr: "",
      amountCr: "",
      // balance: "",
    });
  };

  const saveNewRow = async () => {
    try {
      const response = await ADD_ACCOUNT_STATEMENT(newRowData);
      if (response?.status == 200) {
        getData(page);
        setHideRow(false);
        setNewRowData({
          date: "",
          type: "",
          number: "",
          paymentType: "",
          amountDr: "",
          amountCr: "",
          // balance: "",
        });
      } else {
        console.error("Failed to update the data", response);
      }
    } catch (error) {
      toastAlert("error", error?.response?.data?.message);
      console.error("Error updating the data", error);
    }
  };

  const removeRow = (index) => {
    const newData = data?.filter((_, i) => i !== index);
    setList((prevState) => ({
      ...prevState,
      data: newData,
    }));
  };

  const cancelNewRow = () => {
    setHideRow(false);
    setNewRowData({
      date: "",
      type: "",
      number: "",
      paymentType: "",
      amountDr: "",
      amountCr: "",
      balance: "",
    });
  };

  const totalCredit = data?.reduce(
    (acc, item) => acc + (Number(item.amountCr) || 0),
    0
  );
  const totalDebit = data?.reduce(
    (acc, item) => acc + (Number(item.amountDr) || 0),
    0
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-end p-3">
        <b>Download: &nbsp;</b>
        <FaDownload
          onClick={getDataDownloadReport}
          className="download-icon"
          title="Download account statement"
        />
        <span className="fw-bold  mx-3">
          Opening Balance: {list?.openningBalence ? list?.openningBalence : 0}
        </span>

        <span className="fw-bold">
          Total Credit Amount: {parseFloat(totalCredit)?.toFixed(2)}
        </span>
        <span className="fw-bold mx-3">
          Total Debit Amount: {parseFloat(totalDebit)?.toFixed(2)}
        </span>
        <span className="fw-bold">
          Closing Balance: {list?.closingBalence ? list?.closingBalence : 0}
        </span>
      </div>

      <div className="m-2 main">
        <table className="table table-striped table-bordered text-center ">
          <thead className="thead-light">
            <tr>
              <th>Sn.</th>
              <th>Date</th>
              <th>Type</th>
              <th>Order Number</th>
              {/* <th>Payment Type</th> */}
              <th>Amount Dr</th>
              <th>Amount Cr</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={item.id}>
                <td>{serialNumber(page, index)}</td>
                <td>{moment(item?.date).format("DD-MM-YYYY")}</td>
                <td>
                  {editIndex === item?._id ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter type"
                      value={tempData.type}
                      onChange={(e) =>
                        setTempData({ ...tempData, type: e.target.value })
                      }
                      onKeyPress={restrictNum1}
                    />
                  ) : (
                    item.type ?? ""
                  )}
                </td>
                <td>
                  {editIndex === item?._id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={tempData.number}
                      onChange={(e) =>
                        setTempData({ ...tempData, number: e.target.value })
                      }
                    />
                  ) : (
                    item.number
                  )}
                </td>

                <td>
                  {editIndex === item?._id ? (
                    <input
                      type="number"
                      className="form-control"
                      value={tempData.amountDr ?? "-"}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          amountDr: parseFloat(e.target.value),
                          amountCr: "",
                        })
                      }
                      // disabled={tempData.type == 1}
                      disabled={tempData.amountCr}
                    />
                  ) : (
                    item.amountDr ?? "-"
                  )}
                </td>
                <td>
                  {editIndex === item?._id ? (
                    <input
                      type="number"
                      className="form-control"
                      value={tempData.amountCr ?? "-"}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          amountCr: parseFloat(e.target.value),
                          amountDr: "",
                        })
                      }
                      // disabled={tempData.type == 2}
                      disabled={tempData.amountDr}
                    />
                  ) : (
                    item.amountCr ?? "-"
                  )}
                </td>
                <td>{item.balance}</td>

                <td>
                  {item?.isManuallyAdded == true ? (
                    editIndex === item?._id ? (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => saveChanges(index)}
                          title="Save"
                        >
                          <FaSave />
                        </button>
                        <button
                          className="btn btn-secondary ms-2"
                          onClick={cancelEdit}
                          title="Cancel"
                        >
                          <RxCross1 />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEditClick(item?._id)}
                          title="Edit"
                        >
                          <MdModeEdit />
                        </button>
                      </>
                    )
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {Math.ceil(list?.total / 10) > 1 && (
          <Pagination
            totalCount={list?.total}
            handelPageChange={(e) => setPage(e.selected + 1)}
          />
        )}
      </div>

      {!!hideRow && (
        <div className="m-2 ">
          <h5>Add New Row</h5>
          <div className="row">
            <div className="col">
              <DatePicker
                autoComplete="off"
                name="date"
                selected={newRowData?.date}
                onChange={(date) =>
                  setNewRowData({
                    ...newRowData,
                    date: moment(date).format("lll"),
                  })
                }
                className="form-control"
                placeholderText="Select Date"
                maxDate={moment().add(1, "month").toDate()}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Enter type"
                value={newRowData.type}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, type: e.target.value })
                }
                onKeyPress={restrictNum1}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Order Number"
                value={newRowData.number}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, number: e.target.value })
                }
                maxLength={7}
                onKeyPress={restrictAlpha}
              />
            </div>

            <div className="col">
              <input
                type="number"
                className="form-control"
                value={newRowData.amountDr}
                placeholder="Enter Amount Dr"
                onChange={(e) =>
                  setNewRowData({
                    ...newRowData,
                    amountDr: parseFloat(e.target.value),
                    // amountCr: "",
                  })
                }
                // disabled={newRowData.type == 1}
                // disabled={newRowData.amountCr}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Enter Amount Cr"
                value={newRowData.amountCr}
                onChange={(e) =>
                  setNewRowData({
                    ...newRowData,
                    amountCr: parseFloat(e.target.value),
                    // amountDr: "",
                  })
                }
                // disabled={newRowData.type == 2}
                // disabled={newRowData.amountDr}
              />
            </div>
            {/* <div className="col">
              <input
                type="number"
                className="form-control"
                value={newRowData.balance}
                placeholder="Balance"
                onChange={(e) =>
                  setNewRowData({
                    ...newRowData,
                    balance: parseFloat(e.target.value),
                  })
                }
              />
            </div> */}

            <div className="col">
              <button
                className="btn btn-success"
                onClick={saveNewRow}
                title="Save New Row"
              >
                <FaSave />
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={cancelNewRow}
                title="Cancel"
              >
                <IoRemoveCircleSharp />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-end mt-3 p-2">
        <button className="btn btn-theme" onClick={addRow} title=" Add">
          <RiAddLargeFill />
        </button>
      </div>
    </>
  );
};

export default EditableTable;
