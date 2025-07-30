/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const apiKey = "[YOUR API KEY]"; // Replace with your API key
const mainApiKey = "main_440f58770968dbeba781e0cm342m5vf"; // Replace with your main API key
const apiUrl = "https://api.armadadelivery.com";
// const apiUrl = 'https://api.armadadelivery.com'

module.exports = {
  getDelivery: async (orderCode) => {
    const response = await fetch(`${apiUrl}/v0/deliveries/${orderCode}`, {
      method: "GET",
      headers: {
        Authorization: `Key ${apiKey}`,
      },
    });
    const data = await response.json();
    return data;
  },

  createBranch: async (dataObj) => {
    const response = await fetch(`${apiUrl}/v0/branches`, {
      method: "POST",
      headers: {
        Authorization: `Key ${mainApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dataObj.name,
        phone: dataObj.phone,
        address: {
          location: {
            latitude: dataObj.latitude,
            longitude: dataObj.longitude,
          },
          firstLine: dataObj.address,
        },
        webhook: process.env.ARMADA_WEBHOOK,
      }),
    });
    const data = await response.json();
    return data;
  },

  getAllBranches: async () => {
    const response = await fetch("${apiUrl}/v0/branches", {
      method: "GET",
      headers: {
        Authorization: `Key ${mainApiKey}`,
      },
    });
    const data = await response.json();
    return data;
  },

  getBranch: async (branchId) => {
    const response = await fetch(`${apiUrl}/v0/branches/${branchId}`, {
      method: "GET",
      headers: {
        Authorization: `Key ${apiKey}`,
      },
    });
    const data = await response.json();
    return data;
  },

  updateBranch: async (dataObj) => {
    const response = await fetch(`${apiUrl}/v0/branches/${dataObj.branchId}`, {
      method: "PUT",
      headers: {
        Authorization: `Key ${dataObj.branchKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dataObj.name,
        phone: dataObj.phone,
        address: {
          location: {
            latitude: dataObj.latitude,
            longitude: dataObj.longitude,
          },
          firstLine: dataObj.address,
        },
        webhook: process.env.ARMADA_WEBHOOK,
      }),
    });

    const data = await response.json();
    return data;
  },

  deleteBranch: async (branchId, branchKey) => {
    const response = await fetch(`${apiUrl}/v0/branches/${branchId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Key ${branchKey}`,
      },
    });
    const data = await response.json();
    return data;
  },

  estimateDelivery: async (dataObj) => {
    const response = await fetch("${apiUrl}/v0/deliveries/estimate", {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: dataObj.branchId,
        destination: {
          latitude: dataObj.latitude,
          longitude: dataObj.longitude,
        },
      }),
    });
    const data = await response.json();
    return data;
  },

  createDelivery: async (dataObj, branchKey) => {
    
    const response = await fetch(`${apiUrl}/v0/deliveries`, {
      method: "POST",
      headers: {
        Authorization: `Key ${branchKey}`,
        "order-webhook-key": "vE6gH8Rt2L1sK9w",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platformName: dataObj.platformName,
        platformData: {
          orderId: dataObj.orderId,
          name: dataObj.name,
          phone: dataObj.phone,
          location: {
            latitude: dataObj.latitude,
            longitude: dataObj.longitude,
          },
          amount: dataObj.amount,
          paymentType: dataObj.type,
        },
      }),
    });

    const data = await response.json();
    return data;
  },

  cancelDelivery: async (orderCode, branchKey) => {
    const response = await fetch(
      `${apiUrl}/v0/deliveries/${orderCode}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${branchKey}`,
        },
      }
    );

    const data = await response.json();

    return data;
  },
};
