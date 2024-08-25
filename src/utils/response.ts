/**
 * Returns response object
 * @param {string} message Response message
 * @param {*} data Data to be returned
 * @param {boolean} success Status of the request
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const response = (message: string, data: any, success?: boolean) => {
  return {
    message: formatMessage(message),
    data: data || null,
    success: success == null ? true : success,
  };
};

export const formatMessage = (str: string) => {
  if (!str) return "";

  // Make first letter capital
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default response;
