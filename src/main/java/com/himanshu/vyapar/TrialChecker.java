package com.himanshu.vyapar;

import jakarta.annotation.PostConstruct;

import java.io.File;
import java.net.URISyntaxException;
import java.time.LocalDate;

public class TrialChecker {
    // ✅ Set expiry date here
    private static final LocalDate EXPIRY_DATE = LocalDate.of(2025, 8, 9);

    @PostConstruct
    public void checkTrial() {
        if (LocalDate.now().isAfter(EXPIRY_DATE)) {
            System.out.println("🚫 Trial expired. Application will now close.");
            triggerSelfDelete(); // Comment this line if you don't want auto-delete
            System.exit(0);
        } else {
            System.out.println("✅ Trial valid. App is starting...");
        }
    }

    // ✅ Optional: Self-delete the jar or exe file
    private void triggerSelfDelete() {
        try {
            String path = new File(
                    TrialChecker.class.getProtectionDomain()
                            .getCodeSource()
                            .getLocation()
                            .toURI()
            ).getPath();

            String os = System.getProperty("os.name").toLowerCase();
            if (os.contains("win")) {
                // Windows delete script
                String cmd = "cmd /c timeout 3 & del /f \"" + path + "\"";
                Runtime.getRuntime().exec(cmd);
            } else {
                // Linux/Mac delete command
                String cmd = "/bin/sh -c \"sleep 3 && rm -f '" + path + "'\"";
                Runtime.getRuntime().exec(cmd);
            }

        } catch (URISyntaxException | java.io.IOException e) {
            e.printStackTrace();
        }
    }
}
