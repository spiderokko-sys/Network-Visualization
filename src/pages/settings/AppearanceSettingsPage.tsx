import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

export const AppearanceSettingsPage = () => {
    const { themeMode, setThemeMode } = useTheme();

    const themeOptions = [
        {
            value: 'light',
            label: 'Light',
            description: 'Light theme for daytime use',
            icon: Sun,
        },
        {
            value: 'dark',
            label: 'Dark',
            description: 'Dark theme for low-light environments',
            icon: Moon,
        },
        {
            value: 'system',
            label: 'System',
            description: 'Automatically match your system theme',
            icon: Monitor,
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appearance</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Customize how the application looks and feels
                </p>
            </div>

            <div className="space-y-6">
                <Card className="border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle>Theme</CardTitle>
                        <CardDescription>
                            Select your preferred theme or let it match your system settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={themeMode}
                            onValueChange={(value) => setThemeMode(value as 'dark' | 'light' | 'system')}
                            className="grid gap-4"
                        >
                            {themeOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <div key={option.value} className="relative">
                                        <RadioGroupItem
                                            value={option.value}
                                            id={option.value}
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor={option.value}
                                            className="flex items-center gap-4 rounded-lg border-2 border-slate-200 dark:border-slate-800 p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/30"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 peer-data-[state=checked]:bg-blue-100 dark:peer-data-[state=checked]:bg-blue-900">
                                                <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {option.label}
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    {option.description}
                                                </div>
                                            </div>
                                            {themeMode === option.value && (
                                                <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                                            )}
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
