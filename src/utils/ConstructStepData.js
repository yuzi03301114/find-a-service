function constructStepData(status = 'needDetail') {
  const pending = {
    title: 'Pending',
    description: "Waiting service provider's response... ",
    cur: false,
  }
  const reject = {
    title: 'Rejected',
    description: 'Rejected by service provider. ',
    cur: false,
  }
  const accept = {
    title: 'Accepted',
    description: 'Accepted by service provider. ',
    cur: false,
  }
  const detail = {
    title: ' Further details required',
    description: 'Waiting the customer for more detail. ',
    cur: true,
  }
  const decide = {
    title: 'My action',
    description: 'Please accept or reject this request. You can also ask the customer give more detail. ',
    cur: false,
  }
  const complete = {
    title: 'Completed',
    description: 'The service is done. ',
    cur: true,
  }

  const withdrawn = {
    title: 'Withdrawn',
    description: 'The service is withdrawn. ',
    cur: true,
  }

  const working = {
    title: 'Working',
    description: 'You have accepted this request. Please complete the service in time.',
    cur: true,
  }
  if (status === 'pending') return [{ ...pending, cur: true }]
  if (status === 'rejected') return [pending, reject, complete]
  if (status === 'accepted') return [pending, accept, working]
  if (status === 'completed') return [pending, accept, complete]
  if (status === 'needDetail') return [pending, detail]
  if (status === 'withdrawn') return [pending, detail, withdrawn]
}

export default constructStepData
