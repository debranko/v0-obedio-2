"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/ui-patterns/section-card"
import { Plus, Users, ShieldCheck, UserCog } from "lucide-react"
import { UsersTable } from "@/components/settings/users/users-table"
import { AddUserModal } from "@/components/settings/users/add-user-modal"
import { EditUserPermissionsModal } from "@/components/settings/users/edit-user-permissions-modal"
import { fadeIn } from "@/lib/animation-utils"

export default function UsersPermissionsTab() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isEditPermissionsModalOpen, setIsEditPermissionsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const handleAddUser = () => {
    setIsAddUserModalOpen(true)
  }

  const handleEditPermissions = (user: any) => {
    setSelectedUser(user)
    setIsEditPermissionsModalOpen(true)
  }

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Users & Crew Management</h2>
          <p className="text-muted-foreground">Manage crew members, user accounts, and system permissions</p>
        </div>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      <SectionCard
        title="Users & Crew Members"
        description="Manage all personnel with system access"
        icon={<Users className="h-5 w-5" />}
      >
        <UsersTable onEditPermissions={handleEditPermissions} />
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard
          title="Role Templates"
          description="Manage predefined permission sets"
          icon={<UserCog className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Role templates define default permissions for each crew position. Customize these templates to quickly
              apply standard permission sets.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <span>Admin</span>
              </Button>
              <Button variant="outline" className="justify-start">
                <span>Chief Stewardess</span>
              </Button>
              <Button variant="outline" className="justify-start">
                <span>Stewardess</span>
              </Button>
              <Button variant="outline" className="justify-start">
                <span>Junior Steward</span>
              </Button>
              <Button variant="outline" className="justify-start">
                <span>Engineer</span>
              </Button>
              <Button variant="outline" className="justify-start text-primary">
                <Plus className="h-4 w-4 mr-2" />
                <span>New Template</span>
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Security Settings"
          description="Configure system-wide security policies"
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure security policies that apply to all users, including password requirements, session timeouts,
              and login restrictions.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <span>Password Policy</span>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span>Session Management</span>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span>Login Restrictions</span>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span>Two-Factor Authentication</span>
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Modals */}
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} />

      {selectedUser && (
        <EditUserPermissionsModal
          isOpen={isEditPermissionsModalOpen}
          onClose={() => setIsEditPermissionsModalOpen(false)}
          user={selectedUser}
        />
      )}
    </motion.div>
  )
}
