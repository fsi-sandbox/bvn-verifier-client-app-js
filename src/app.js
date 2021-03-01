const digitPattern = /^\d+$/;
const bvnPattern = /^\d{11}$/;
const BACKEND = 'https://bvn-verifier.herokuapp.com';

let alreadyChecking = false;

const verifyBVN = async (bvn) => {
  try {
    const response = await fetch(`${BACKEND}/verify/bvn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bvn })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(error); 
    return {
      error: error.message
    };
  }
};

const handleInput = async (e) => {
  const { target } = e;
  const { value } = target;

  if (alreadyChecking
      || !digitPattern.test(value)
      || !bvnPattern.test(value)) return;

  alreadyChecking = true;
  requestAnimationFrame(() => {
    target.classList.remove('invalid', 'valid');
    target.classList.add('busy');
  });
  const { verification, error } = await verifyBVN(value);

  alreadyChecking = false;
  requestAnimationFrame(() => {
    target.classList.remove('busy');
    target.removeAttribute('disabled');
    let status = verification ? 'valid' : 'invalid';
    status = error ? 'error' : status;
    target.classList.add(status);
  });
};

const startApp = () => {
  const field = document.querySelector('[data-bvn-input]');
  field.addEventListener('input', handleInput);
};

document.addEventListener('DOMContentLoaded', startApp);
