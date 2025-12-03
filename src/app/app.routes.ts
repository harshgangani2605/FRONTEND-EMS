import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

// AUTH
import { LoginComponent } from './features/auth/pages/login/login';
import { RegisterComponent } from './features/auth/pages/register/register';

// LAYOUT
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout';

// DASHBOARD
import { DashboardComponent } from './features/dashboard/dashboard';

// EMPLOYEES
import { EmployeeListComponent } from './features/employees/pages/list/employee-list';
import { EmployeeCreateComponent } from './features/employees/pages/create/employee-create';
import { EmployeeEditComponent } from './features/employees/pages/edit/employee-edit';
import { DepartmentListComponent } from './features/departments/pages/list/department-list';
import { DepartmentCreateComponent } from './features/departments/pages/create/department-create';
import { DepartmentEditComponent } from './features/departments/pages/edit/department-edit';
import { SkillListComponent } from './features/skills/pages/list/skill-list';
import { SkillCreateComponent } from './features/skills/pages/create/skill-create';
import { SkillEditComponent } from './features/skills/pages/edit/skill-edit';
import { UserCreateComponent } from './features/users/pages/user-create/user-create';
import { UserListComponent } from './features/users/pages/user-list/user-list';
import { UserEditComponent } from './features/users/pages/user-edit/user-edit';

import { RoleManageComponent } from './features/roles/pages/role-manage/role-manage';
import { RolesListComponent } from './features/roles/pages/roles-list/roles-list';
import { RoleCreate } from './features/roles/pages/role-create/role-create';
import { ProfileComponent } from './features/profile/profile';
import { HasPermissionDirective } from './shared/directives/has-permission.directive';
import { PermissionGuard } from './core/guards/permission.guard';
import { Forbidden } from './forbidden/forbidden';




export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'forbidden',component:Forbidden},
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      { path: '', component: DashboardComponent},
      { path: 'dashboard', component: DashboardComponent },

      // EMPLOYEES
      { path: 'employees', component: EmployeeListComponent,
        canActivate:[PermissionGuard],
        data:{permission: 'employee.view'} },
      { path: 'employees/create', component: EmployeeCreateComponent,
        canActivate:[PermissionGuard],
        data:{permission: 'employee.create'} },
      { path: 'employees/edit/:id', component: EmployeeEditComponent,
        canActivate:[PermissionGuard],
        data:{permission: 'employee.edit'} },

      // DEPARTMENTS
      { path: 'department', component: DepartmentListComponent,
         canActivate:[PermissionGuard],
        data:{permission: 'department.view'}
       },
      { path: 'department/create', component: DepartmentCreateComponent,
         canActivate:[PermissionGuard],
        data:{permission: 'department.create'} },
      { path: 'department/edit/:id', component: DepartmentEditComponent,
         canActivate:[PermissionGuard],
        data:{permission: 'department.edit'} },

      // SKILLS
      { path: 'skills', component: SkillListComponent,
         canActivate:[PermissionGuard],
        data:{permission: 'skill.view'}  },
      { path: 'skills/create', component: SkillCreateComponent,
         canActivate:[PermissionGuard],
        data:{permission: 'skill.create'}  },
      { path: 'skills/edit/:id', component: SkillEditComponent,
         canActivate:[PermissionGuard],
        data:{permission: 'skill.edit'}  },

      // USERS
      { path: 'users', component: UserListComponent,
         canActivate:[PermissionGuard],
        data:{permission: 'user.view'}  },
      { path: 'users/create', component: UserCreateComponent ,
         canActivate:[PermissionGuard],
        data:{permission: 'user.create'} },
      { path: 'users/edit/:email', component: UserEditComponent ,
         canActivate:[PermissionGuard],
        data:{permission: 'user.edit'} },

      // ROLES
      { path: 'roles', component: RolesListComponent,
         canActivate:[PermissionGuard],
        data:{permission: 'role.manage'}  },
      { path: 'roles/:id/manage', component: RoleManageComponent,
         canActivate:[PermissionGuard],
        data:{permission: 'role.manage'}  },
      { path: 'roles/create', component: RoleCreate,
         canActivate:[PermissionGuard],
        data:{permission: 'role.create'}  },   // FIXED path

      { path: 'profile', component: ProfileComponent },

    ],
  },

  // FIXED FALLBACK
  { path: '**', redirectTo: '' }
];


