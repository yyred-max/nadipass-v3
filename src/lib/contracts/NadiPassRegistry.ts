// Contract ABI + config for NadiPassRegistry (Monad testnet).
// Generated from the PRD spec:
//   function logBreakGlass(bytes32 patientId, bytes32 dataHash, bytes32 reasonHash) external
//   event BreakGlassLogged(bytes32 indexed patientId, bytes32 dataHash, bytes32 reasonHash, uint256 timestamp)

export const CONTRACT_NAME = 'NadiPassRegistry';

// Minimal ABI needed for the MVP (read + the single write function).
export const ABI = [
  {
    inputs: [
      { name: 'patientId', type: 'bytes32' },
      { name: 'dataHash', type: 'bytes32' },
      { name: 'reasonHash', type: 'bytes32' },
    ],
    name: 'logBreakGlass',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'patientId', type: 'bytes32' },
      { indexed: false, name: 'dataHash', type: 'bytes32' },
      { indexed: false, name: 'reasonHash', type: 'bytes32' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'BreakGlassLogged',
    type: 'event',
  },
] as const;

export const LOG_BREAK_GLASS_SELECTOR = 'logBreakGlass';

export interface LogBreakGlassParams {
  patientId: `0x${string}`;
  dataHash: `0x${string}`;
  reasonHash: `0x${string}`;
}
