import logo from "../../assets/logo.png"

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#2E2E2E]">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Lovely Prints"
            className="w-10 drop-shadow-[0_0_8px_rgba(245,130,32,0.6)]"
          />
          <h1 className="text-xl font-semibold text-[#F58220]">
            Lovely Prints
          </h1>
        </div>

        <div className="w-9 h-9 rounded-full bg-[#F58220] flex items-center justify-center font-bold">
          S
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8">

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-[#FFBF8A] mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#2E2E2E] p-5 rounded-lg hover:-translate-y-1 transition cursor-pointer">
              <h3 className="font-semibold text-lg">New Print Order</h3>
              <p className="text-sm text-gray-300 mt-1">
                Upload documents & configure print options
              </p>
            </div>

            <div className="bg-[#2E2E2E] p-5 rounded-lg hover:-translate-y-1 transition cursor-pointer">
              <h3 className="font-semibold text-lg">Track Order</h3>
              <p className="text-sm text-gray-300 mt-1">
                Check real-time order status
              </p>
            </div>

            <div className="bg-[#2E2E2E] p-5 rounded-lg hover:-translate-y-1 transition cursor-pointer">
              <h3 className="font-semibold text-lg">Order History</h3>
              <p className="text-sm text-gray-300 mt-1">
                View previous orders & receipts
              </p>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#FFBF8A]">
              Recent Orders
            </h2>

            <button className="bg-[#F58220] hover:bg-[#C65A00] px-4 py-2 rounded-md font-semibold transition">
              + Place New Order
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-[#2E2E2E] p-5 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">Order #LP1023</p>
                <p className="text-sm text-[#F1C40F]">Status: In Progress</p>
              </div>
              <p className="font-semibold">₹45</p>
            </div>

            <div className="bg-[#2E2E2E] p-5 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">Order #LP1018</p>
                <p className="text-sm text-[#2ECC71]">Status: Completed</p>
              </div>
              <p className="font-semibold">₹30</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

export default StudentDashboard
