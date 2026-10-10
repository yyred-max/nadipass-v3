import {
  createWalletClient,
  http,
  keccak256,
  toBytes,
  type Chain,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const MONAD_RPC_URL =
  (import.meta.env.VITE_MONAD_RPC_URL as string) ||
  'https://testnet-rpc.monad.xyz';

const REGISTRY_ADDRESS = (import.meta.env.VITE_NADIPASS_REGISTRY as string) || '';
const PRIVATE_KEY = (import.meta.env.VITE_MONAD_PRIVATE_KEY as string) || '';

export const monadTestnet: Chain = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MonadVision', url: 'https://testnet.monadvision.com' },
  },
  testnet: true,
};

const ABI = [
  {
    name: 'logBreakGlass',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'patientId', type: 'bytes32' },
      { name: 'dataHash', type: 'bytes32' },
      { name: 'reasonHash', type: 'bytes32' },
    ],
    outputs: [],
  },
] as const;

export function isMonadConfigured(): boolean {
  return Boolean(REGISTRY_ADDRESS && PRIVATE_KEY);
}

export async function logBreakGlassOnChain(
  patientId: string,
  dataHash: string,
  reason: string,
): Promise<string | null> {
  try {
    if (!PRIVATE_KEY || !REGISTRY_ADDRESS) {
      console.warn('[monad] skip: env not set');
      return null;
    }

    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
    const client = createWalletClient({
      account,
      chain: monadTestnet,
      transport: http(MONAD_RPC_URL),
    });

    const patientIdHash = keccak256(toBytes(patientId));
    const dataHashBytes = keccak256(toBytes(dataHash));
    const reasonHashBytes = keccak256(toBytes(reason));

    const txHash = await client.writeContract({
      address: REGISTRY_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'logBreakGlass',
      args: [patientIdHash, dataHashBytes, reasonHashBytes],
    });

    console.log('[monad] logged:', txHash);
    return txHash;
  } catch (err) {
    console.error('[monad] log failed:', err);
    return null;
  }
}