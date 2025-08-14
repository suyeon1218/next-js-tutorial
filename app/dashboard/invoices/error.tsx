'use client';
// * error.tsx는 클라이언트 컴포넌트여야 한다.

import { useEffect } from 'react';

/**
 * @param error - Javascript native error object
 * @param reset - 에러 바운더리를 재설정하는 함수로 라우트 세그먼트를 리렌더링한다.
 * @returns 에러 메시지와 재시도 버튼
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className='flex h-full flex-col items-center justify-center'>
      <h2 className='text-center'>Something went wrong!</h2>
      <button
        className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400'
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }>
        Try again
      </button>
    </main>
  );
}
