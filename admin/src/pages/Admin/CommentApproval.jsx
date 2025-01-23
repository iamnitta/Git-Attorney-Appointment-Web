import React from "react";

const CommentApproval = () => {
  return (
    <div className="p-8 w-full">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          อนุมัติความคิดเห็น
        </h1>
      </div>

      <div className="flex flex-row gap-2 mb-4 mt-4 w-1/3">
        <button className="flex-1 rounded-full border border-dark-brown text-dark-brown text-center text-xl px-8 py-1 hover:bg-dark-brown hover:text-white">
          รออนุมัติ
        </button>
        <button className="flex-1 rounded-full border border-dark-brown text-dark-brown text-center text-xl px-8 py-1 hover:bg-dark-brown hover:text-white">
          อนุมัติแล้ว
        </button>
      </div>

      <div className="bg-[#F7F7F7] w-full max-w-7xl min-h-[600px] mt-2 mx-auto p-6 mb-6 rounded"></div>
    </div>
  );
};

export default CommentApproval;
