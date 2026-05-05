import { useParams } from 'react-router-dom'

export function EmployeeAttendancePage() {
  const { employeeId } = useParams<{ employeeId: string }>()
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Attendance History</h1>
      <p className="text-gray-500">Viewing history for employee: {employeeId}</p>
    </div>
  )
}
