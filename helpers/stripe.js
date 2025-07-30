const secret_key = process.env.STRIPE_API_KEY;
const stripe = require("stripe")(secret_key);


//retrieves the current account balance
const accountBalance = async () => {
  let response = {};
  try {
    const balance = await stripe.balance.retrieve();
    if (balance) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Account balance get successfully.";
      response.data = balance;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers; // Remove the "headers" object from the response
  }
  return response;
};

//create a customer
const customer = async (name, email) => {
  let response = {};
  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
    });
    if (customer) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Customer created successfully";
      response.data = customer;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

// Update the default payment method for the Customer
const customerUpdate = async (customerId, paymentMethodId) => {
  let response = {};
  try {
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    if (customer) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Customer updated successfully";
      response.data = customer;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

// Retrieve a customer
const customerRetrieves = async (customerId) => {
  let response = {};
  try {
    const customer = await stripe.customers.retrieve(customerId);

    if (customer) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Customer retrieves successfully";
      response.data = customer;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//create a payment method
const paymentMethod = async (cardTokenId) => {
  let response = {};
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: cardTokenId,
      },
    });
    if (paymentMethod) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Payment method created successfully";
      response.data = paymentMethod;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//returns a list of PaymentMethods
const paymentMethods = async (limit, customerId) => {
  let response = {};
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      type: "card",
      limit: limit,
      customer: customerId,
    });
    if (paymentMethods) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Payment method list found successfully";
      response.data = paymentMethods;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Attach a PaymentMethod to a Customer
const attachCustomerPaymentMethod = async (paymentMethodId, customerId) => {
  let response = {};
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    if (paymentMethod) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Payment method attach to a Customer successfully";
      response.data = paymentMethod;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Detach a PaymentMethod from a Customer
const detachCustomerPaymentMethod = async (paymentMethodId) => {
  let response = {};
  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    if (paymentMethod) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Payment method detach to a Customer successfully";
      response.data = paymentMethod;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Create a PaymentIntent
const paymentIntent = async (amount, paymentMethodId, customerId) => {
  let response = {};
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
      payment_method: paymentMethodId,
      customer: customerId,
    });

    if (paymentIntent) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Payment intent created successfully";
      response.data = paymentIntent;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Confirm a PaymentIntent
const confirmPaymentIntent = async (paymentIntentId, returnUrl) => {
  let response = {};
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: "pm_card_visa",
      return_url: returnUrl,
    });

    if (paymentIntent) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Payment intent Confirm successfully";
      response.data = paymentIntent;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//create an account
const account = async () => {
  let response = {};
  try {
    const account = await stripe.accounts.create({
      type: "standard",
      country: "IN",
    });
    if (account) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Account created successfully";
      response.data = account;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Create an account link
const accountLink = async (accountId) => {
  let response = {};
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });
    if (accountLink) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Account link created successfully";
      response.data = accountLink;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Create a bank account
const bankExternalAccount = async (accountId, bankAccountTokenId) => {
  let response = {};
  try {
    const externalAccount = await stripe.accounts.createExternalAccount(
      accountId,
      {
        external_account: bankAccountTokenId,
      }
    );

    if (externalAccount) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Bank account added successfully";
      response.data = externalAccount;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//List all bank accounts
const bankExternalAccounts = async (accountId, limit) => {
  let response = {};
  try {
    const bankAccounts = await stripe.accounts.listExternalAccounts(accountId, {
      object: "bank_account",
      limit: limit,
    });

    if (bankAccounts) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Bank account list found successfully";
      response.data = bankAccounts;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Create a transfer To send funds from your Stripe account to a connected account
const createTransfer = async (amount, accountId) => {
  let response = {};
  try {
    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: "usd",
      destination: accountId,
    });

    if (transfer) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Fund transfer successfully";
      response.data = transfer;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Creates a new product
const createProduct = async (name) => {
  let response = {};
  try {
    const product = await stripe.products.create({
      name: name,
    });

    if (product) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Product created successfully";
      response.data = product;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Creates a new price
const createPrice = async (amount, productId) => {
  let response = {};
  try {
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: amount,
      product: productId,
    });

    if (price) {
      response.statusCode = 200;
      response.success = true;
      response.message = "price created successfully";
      response.data = price;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//List all prices
const prices = async (limit) => {
  let response = {};
  try {
    const prices = await stripe.prices.list({
      limit: limit,
    });

    if (prices) {
      response.statusCode = 200;
      response.success = true;
      response.message = "price list found successfully";
      response.data = prices;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Creates a Session
const createSession = async (priceId) => {
  let response = {};
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: "https://example.com/success",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
    });

    if (session) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Session created successfully";
      response.data = session;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Returns a list of existing transfers sent to connected accounts.
const getPaymentTransfers = async (accountId, limit) => {
  let response = {};
  try {
    const transfers = await stripe.transfers.list({
      limit: limit,
      destination: accountId,
    });
    if (transfers) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Transfers list found successfully";
      response.data = transfers;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//Create a refund
const createRefund = async (chargeId) => {
  let response = {};
  try {
    const refund = await stripe.refunds.create({
      charge: chargeId,
    });
    if (refund) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Refund created successfully";
      response.data = refund;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//List all refunds
const getRefunds = async (limit) => {
  let response = {};
  try {
    const refunds = await stripe.refunds.list({
      limit: limit,
    });
    if (refunds) {
      response.statusCode = 200;
      response.success = true;
      response.message = "Refund list found successfully";
      response.data = refunds;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};

//List all webhook endpoints
const getWebhookEndpoints = async (limit) => {
  let response = {};
  try {
    const webhookEndpoints = await stripe.webhookEndpoints.list({
      limit: limit,
    });
    if (webhookEndpoints) {
      response.statusCode = 200;
      response.success = true;
      response.message = "webhook endpoints list found successfully";
      response.data = webhookEndpoints;
    }
  } catch (error) {
    response.statusCode = 400;
    response.success = false;
    response.message = error.raw.message;
    response.data = error.raw;
    delete response.data.headers;
  }
  return response;
};


module.exports.accountBalance = accountBalance;
module.exports.customer = customer;
module.exports.paymentMethod = paymentMethod;
module.exports.paymentMethods = paymentMethods;
module.exports.attachCustomerPaymentMethod = attachCustomerPaymentMethod;
module.exports.paymentIntent = paymentIntent;
module.exports.confirmPaymentIntent = confirmPaymentIntent;
module.exports.accountLink = accountLink;
module.exports.bankExternalAccount = bankExternalAccount;
module.exports.bankExternalAccounts = bankExternalAccounts;
module.exports.createTransfer = createTransfer;
module.exports.createProduct = createProduct;
module.exports.createPrice = createPrice;
module.exports.prices = prices;
module.exports.createSession = createSession;
module.exports.getPaymentTransfers = getPaymentTransfers;
module.exports.createRefund = createRefund;
module.exports.getRefunds = getRefunds;
module.exports.getWebhookEndpoints = getWebhookEndpoints;
module.exports.account = account;
module.exports.detachCustomerPaymentMethod = detachCustomerPaymentMethod;
module.exports.customerUpdate = customerUpdate;
module.exports.customerRetrieves = customerRetrieves;
