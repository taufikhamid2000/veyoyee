"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UserPreferencesProps = {
  userId: string;
  initialSettings?: {
    theme?: "light" | "dark" | "system";
    emailNotifications?: boolean;
  };
};

export default function UserPreferences({
  userId,
  initialSettings = { theme: "system", emailNotifications: true },
}: UserPreferencesProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setSettings({ ...settings, theme });
    setSaveStatus("idle");
  };

  const handleNotificationsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings({ ...settings, emailNotifications: e.target.checked });
    setSaveStatus("idle");
  };
  const savePreferences = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const supabase = createClient();

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      let error;

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            theme_preference: settings.theme,
            email_notifications: settings.emailNotifications,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        error = updateError;
      } else {
        // Create new profile if it doesn't exist
        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          theme_preference: settings.theme,
          email_notifications: settings.emailNotifications,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        error = insertError;
      }

      if (error) throw error;
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        User Preferences
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Theme
          </label>
          <div className="flex space-x-4">
            {(["light", "dark", "system"] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`px-3 py-1 rounded-md text-sm ${
                  settings.theme === theme
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={handleNotificationsChange}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">Email notifications</span>
          </label>
        </div>

        <div className="pt-2">
          <button
            onClick={savePreferences}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>

          {saveStatus === "success" && (
            <span className="ml-2 text-sm text-green-600 dark:text-green-400">
              Saved successfully!
            </span>
          )}

          {saveStatus === "error" && (
            <span className="ml-2 text-sm text-red-600 dark:text-red-400">
              Failed to save. Please try again.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
