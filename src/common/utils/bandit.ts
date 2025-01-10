import fs from 'fs';
import path from 'path';

const banditStateFilePath = path.join(process.cwd(), 'banditState.json');

let banditState: any = {
  users: {},
};

export function loadBanditState() {
  if (fs.existsSync(banditStateFilePath)) {
    try {
      const data = fs.readFileSync(banditStateFilePath, 'utf8');
      banditState = JSON.parse(data);
      console.log('Loaded banditState from file.');
    } catch (err) {
      console.error('Error reading banditState.json:', err);
    }
  } else {
    console.log('banditState.json does not exist, starting fresh.');
  }
}

/**
 * Save the current bandit state to the JSON file.
 */
export function saveBanditState() {
  try {
    fs.writeFileSync(banditStateFilePath, JSON.stringify(banditState, null, 2), 'utf8');
    console.log('✅ Saved banditState to file.');
  } catch (err) {
    console.error('❌ Error writing banditState.json:', err);
  }
}

/**
 * Retrieve the current bandit state.
 */
export function getBanditState() {
  return banditState;
}
