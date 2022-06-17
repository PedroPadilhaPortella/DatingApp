import { RolesModalComponent } from './../../shared/modals/roles-modal/roles-modal.component';
import { AdminService } from './../../../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { initialState } from 'ngx-bootstrap/timepicker/reducer/timepicker.reducer';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
    users: Partial<User[]>;
    modalRef?: BsModalRef;

    constructor(
        private adminService: AdminService,
        private modalService: BsModalService
    ) { }

    ngOnInit() {
        this.getUsersWithRoles();
    }

    getUsersWithRoles() {
        this.adminService.getUsersWithRoles()
            .subscribe(users => this.users = users);
    }

    openRolesModal(user: User) {
        const modalConfig = {
            class: 'modal-dialog-centered',
            initialState: {
                user, 
                roles: this.getRolesArray(user),
            }
        }
        this.modalRef = this.modalService.show(RolesModalComponent, modalConfig);
        this.modalRef.content.updateSelectedRoles.subscribe(values => {
            const rolesToUpdate = { 
                roles: [...values.filter(el => el.checked == true).map(el => el.name)] 
            };
            if(rolesToUpdate) {
                this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() => {
                    user.roles = [...rolesToUpdate.roles];
                });
            }
        });
    }

    getRolesArray(user: User) {
        const roles = [];
        const userRoles = user.roles;
        const availableRoles: any[] = [
            {name: 'Admin', value: 'Admin'},
            {name: 'Moderator', value: 'Moderator'},
            {name: 'Member', value: 'Member'},
        ]

        availableRoles.forEach(role => {
            let isMatch = false;
            for(const userRole of userRoles) {
                if (role.name == userRole) {
                    isMatch = true;
                    role.checked = true;
                    roles.push(role);
                    break;
                }
            }

            if (!isMatch) {
                role.checked = false;
                roles.push(role);
            }
        })

        return roles;
    }
}
