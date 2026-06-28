import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useDashboard from "../../hooks/useDashboard";
import useAuth from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";
import ProfileImg from "../../components/ui/ProfileImg";
import { updateUser } from "../../api/organisationApi";
import { changePassword } from "../../api/authApi";

function Section({ title, subtitle, children }) {
  return (
    <Card className="border-white/10 rounded-2xl p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-text font-bold text-lg">{title}</h2>
        {subtitle && <p className="text-muted text-sm mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}

function VoterSettingsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Settings");
    setSubtitle("Manage your profile and preferences");
  }, [setPageTitle, setSubtitle]);

  const { user, login } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  const passwordForm = useForm({ mode: "onChange" });

  async function handleProfileSave(data) {
    setSavingProfile(true);
    try {
      await updateUser(user.id, {
        first_name: data.firstName,
        last_name: data.lastName,
      });
      login({ ...user, firstName: data.firstName, lastName: data.lastName });
      toast.success("Profile updated.");
      setEditingProfile(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.detail || "Failed to update profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSave(data) {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError("confirmPassword", {
        message: "Passwords do not match.",
      });
      return;
    }
    try {
      await changePassword({
        old_password: data.currentPassword,
        new_password: data.newPassword,
      });
      toast.success("Password changed successfully.");
      passwordForm.reset();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.old_password?.[0] ||
        "Failed to change password.";
      passwordForm.setError("currentPassword", { message: msg });
    }
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-2xl">
      {/* Profile */}
      <Section title="My Profile" subtitle="Your personal information">
        <div className="flex items-center gap-4">
          <ProfileImg className="w-16 h-16 shrink-0" />
          <div>
            <p className="text-text font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-muted text-sm">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-primary/12 text-primary capitalize">
              {user?.role ?? "member"}
            </span>
          </div>
        </div>

        {editingProfile ? (
          <form
            onSubmit={profileForm.handleSubmit(handleProfileSave)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="First name"
                error={profileForm.formState.errors.firstName?.message}
                {...profileForm.register("firstName", { required: "Required" })}
              />
              <Input
                label="Last Name"
                placeholder="Last name"
                error={profileForm.formState.errors.lastName?.message}
                {...profileForm.register("lastName", { required: "Required" })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={user?.email ?? ""}
              disabled
              placeholder="Email"
            />
            <div className="flex gap-3">
              <Button
                name={savingProfile ? "Saving..." : "Save Changes"}
                disabled={savingProfile}
              />
              <button
                type="button"
                onClick={() => {
                  setEditingProfile(false);
                  profileForm.reset();
                }}
                className="px-4 py-2 rounded-lg border border-border text-text text-sm hover:bg-background transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-muted text-xs mb-1">First Name</p>
                <p className="text-text">{user?.firstName || "—"}</p>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Last Name</p>
                <p className="text-text">{user?.lastName || "—"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted text-xs mb-1">Email</p>
                <p className="text-text">{user?.email || "—"}</p>
              </div>
            </div>
            <button
              onClick={() => setEditingProfile(true)}
              className="w-fit px-4 py-2 rounded-lg border border-primary text-primary text-sm hover:bg-primary/8 transition"
            >
              Edit Profile
            </button>
          </div>
        )}
      </Section>

      {/* Change Password */}
      <Section title="Change Password" subtitle="Update your login password">
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSave)}
          className="flex flex-col gap-4"
        >
          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register("currentPassword", {
              required: "Required",
            })}
          />
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register("newPassword", {
              required: "Required",
              minLength: { value: 8, message: "Minimum 8 characters" },
            })}
          />
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register("confirmPassword", {
              required: "Required",
            })}
          />
          <div>
            <Button
              name={
                passwordForm.formState.isSubmitting
                  ? "Saving..."
                  : "Change Password"
              }
              disabled={passwordForm.formState.isSubmitting}
            />
          </div>
        </form>
      </Section>
    </div>
  );
}

export default VoterSettingsPage;
