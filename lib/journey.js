export function canApproveItem(status) {
  return status === 'Draft' || status === 'Pending' || status === 'Needs Review';
}

export function isItemApproved(status) {
  return status === 'Approved' || status === 'Active' || status === 'Paused' || status === 'Completed';
}

export function isItemPublished({ status, published }) {
  return published === true || status === 'Active' || status === 'Paused' || status === 'Completed';
}

export function canPublishItem({ status, published }) {
  return isItemApproved(status) && !isItemPublished({ status, published });
}

export function canStartProductCampaign(product) {
  return isItemApproved(product?.status);
}
