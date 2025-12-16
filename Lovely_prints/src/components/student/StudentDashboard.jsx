import logo from "../../assets/logo.png"

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">

      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-[#2E2E2E]">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Lovely Prints"
            className="w-9 sm:w-10 drop-shadow-[0_0_8px_rgba(245,130,32,0.6)]"
          />
          <h1 className="text-lg sm:text-xl font-semibold text-[#F58220]">
            Lovely Prints
          </h1>
        </div>

        <div className="w-9 h-9 rounded-full bg-[#F58220] flex items-center justify-center font-bold">
          S
        </div>
      </header>

      {/* Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8">

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-[#FFBF8A] mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["New Print Order", "Track Order", "Order History"].map((title) => (
              <div
                key={title}
                className="bg-[#2E2E2E] p-5 rounded-lg hover:-translate-y-1 transition cursor-pointer"
              >
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Action related to {title.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Orders */}
        <section className="mt-10">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#FFBF8A]">
              Recent Orders
            </h2>

            <button className="bg-[#F58220] hover:bg-[#C65A00] px-4 py-2 rounded-md font-semibold transition w-full sm:w-auto">
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
